# path to your application root.
APP_ROOT = File.expand_path("..", __dir__)

namespace :data do
  require "fileutils"
  include FileUtils

  def system!(*args)
    system(*args) || abort("\n== Command #{args} failed ==")
  end

  chdir APP_ROOT do
    desc "TODO"
    task backup: :environment do
      system! "heroku pg:backups:capture -a pwrstation-prod"
      system! "heroku pg:backups:capture -a pwrstation-staging"
      system! "heroku pg:backups:capture -a pwrstation-review"
    end

    desc "Transfer Production DB to Staging DB to Review DB"
    task :transfer_all, [:s3] => :environment do |t, args|
      system! "rake data:transfer_to_staging[#{args.s3}]"
      system! "rake data:transfer_to_review[#{args.s3}]"
    end

    # TODO: as part of a transfer we should:
    # disable honeybadger errors
    # Kill sidekiq jobs
    # re-enable honeybadger errors
    # set up a default asset url if it is not already part of JSP so that we don't need s3 files copied for things to work.
    desc "Transfer Staging DB to Review DB"
    task :transfer_to_review, [:s3] => :environment do |t, args|
      system! "heroku maintenance:on -a pwrstation-review"
      system! "heroku pg:backups:capture -a pwrstation-staging"
      system! "heroku pg:reset -a pwrstation-review --confirm pwrstation-review"
      system! "heroku pg:copy pwrstation-staging::DATABASE_URL pwrstation-review::DATABASE_URL -a pwrstation-review --confirm pwrstation-review"
      system! "heroku run bin/rails db:migrate -a pwrstation-review"
      system! "heroku run bin/rails data:reset_pk_sequence --app pwrstation-review"
      system! "heroku maintenance:off -a pwrstation-review"
      system! "heroku run rails generate:activate_canvass_user -a pwrstation-review"
      system! "rails data:s3_to_review" if args.s3.present?
    end

    desc "Transfer Production DB to Staging DB"
    task :transfer_to_staging, [:s3] => :environment do |t, args|
      system! "heroku maintenance:on -a pwrstation-staging"
      system! "heroku pg:backups:capture -a pwrstation-prod"
      system! "heroku pg:reset -a pwrstation-staging --confirm pwrstation-staging"
      system! "heroku pg:copy pwrstation-prod::DATABASE_URL pwrstation-staging::DATABASE_URL --app pwrstation-staging --confirm pwrstation-staging"
      system! "heroku run bin/rails db:migrate -a pwrstation-staging"
      system! "heroku run bin/rails data:reset_pk_sequence --app pwrstation-staging"
      system! "heroku maintenance:off -a pwrstation-staging"
      system! "heroku run rails generate:activate_canvass_user -a pwrstation-staging"
      system! "rails data:s3_to_staging" if args.s3.present?
    end

    desc "Deprecated"
    task transfer_to_prod: :environment do
      puts "POST-MVP can only move from prod to Staging"
      # system! "heroku run bin/rails data:transfer_to_prod -a pwrstation-staging"
      # system! "heroku maintenance:on -a pwrstation-prod"
      # system! "heroku pg:backups:capture -a pwrstation-staging"
      # system! "heroku pg:reset -a pwrstation-prod --confirm pwrstation-prod"
      # system! "heroku pg:copy pwrstation-staging::DATABASE_URL pwrstation-prod::DATABASE_URL --app pwrstation-prod --confirm pwrstation-prod"
      # system! "heroku run bin/rails db:migrate -a pwrstation-prod"
      # system! "rails data:s3_to_prod"
      # system! "heroku run bin/rails data:reset_pk_sequence --app pwrstation-prod"
      # system! "heroku maintenance:off -a pwrstation-prod"
    end

    desc "Obfuscate Review And Staging Data"
    task obfuscate_all: :environment do
      system! "heroku run rake data:obfuscate_review -a pwrstation-review"
      system! "heroku run rake data:obfuscate_staging -a pwrstation-review"
    end

    desc "Obfuscate Review Data"
    task obfuscate_review: :environment do
      system! "heroku run rake data:obfuscate -a pwrstation-review"
    end

    desc "Obfuscate Staging Data"
    task obfuscate_staging: :environment do
      system! "heroku run rake data:obfuscate -a pwrstation-staging"
    end

    desc "Obfuscate Production Data"
    task obfuscate: :environment do
      if Rails.env == "production"
        print "DO NOT DO THAT!!?!?!!\nTHIS IS PRODUCTION, WE DO NOT MESS UP PRODUCTION DATA!!!!!"
      else
        puts "We have not built this yet, but if and when we do, tada, here you go"
        # User.update_all(password: "123123", password_confirmation: "123123")
        # <<< Yeah that doesn't quite work, and also ...
        # we don't like triggering devise emails every time we obfuscate, so that's why we pumped the brakes on this one
      end
    end

    desc "Transfer Review DB to Local DB"
    task :refresh_local, [:s3] => :environment do |t, args|
      system! "heroku pg:backups:capture --app pwrstation-review"
      system! "rm latest.dump"
      system! "heroku pg:backups:download --app pwrstation-review"
      system! "bin/rails data:reset_local"
      puts "\nYour local has the latest info from Review,"
      if args.s3.present?
        puts "\nYou can continue working while attachments are copied to your local."
        system! "rails data:s3_to_local"
      end
    end
  end

  desc "Restore Local DB from Download"
  task reset_local: :environment do
    system! "bin/rails db:environment:set RAILS_ENV=development"
    system! "bin/rails db:drop db:create"
    system "pg_restore --verbose --clean --no-acl --no-owner -h localhost -d #{Rails.configuration.database_configuration["development"]["database"]} latest.dump"
    system! "bin/rails db:migrate"
    system! "bin/rails data:reset_pk_sequence"
  end

  desc "reset active record ids after restoring data"
  task reset_pk_sequence: :environment do
    ActiveRecord::Base.connection.tables.each do |table|
      ActiveRecord::Base.connection.reset_pk_sequence!(table)
    end
    print "\nReset PK sequence completed correctly"
  end

  desc "Sync files from S3 bucket to local storage folder"
  task s3_to_local: :environment do
    s3_bucket = "pwrstation-review"
    access_key_id = Rails.application.credentials.dig(:aws, :access_key_id)
    secret_access_key = Rails.application.credentials.dig(:aws, :secret_access_key)
    storage_folder = Rails.root.join("storage")
    storage_folder.mkpath
    system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 sync s3://#{s3_bucket} #{storage_folder}")
    # Ignores sub_folders already created and .keep files
    images = storage_folder.children.select { |file| file.file? && !file.empty? }

    # Formats the file path of each image so ActiveStorage understands them using :local storage
    images.each do |path_name|
      dir, basename = path_name.split
      file_name = basename.to_s
      sub_folders = dir.join(file_name[0..1], file_name[2..3])
      sub_folders.mkpath # Create the subfolder used by active_record
      path_name.rename(dir + sub_folders + basename) # Renames file to be moved into subfolder
    end
    puts "Finished transfering attachments from Review to Local"
  end

  desc "Sync files from Staging S3 bucket to Review S3 bucket"
  task s3_to_review: :environment do
    from_s3_bucket = "pwrstation-staging"
    to_s3_bucket = "pwrstation-review"
    access_key_id = Rails.application.credentials.dig(:aws, :access_key_id)
    secret_access_key = Rails.application.credentials.dig(:aws, :secret_access_key)
    system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 rm s3://#{to_s3_bucket} --recursive")
    system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 sync s3://#{from_s3_bucket} s3://#{to_s3_bucket}")
  end

  desc "Sync files from Production S3 bucket to Staging S3 bucket"
  task s3_to_staging: :environment do
    from_s3_bucket = "pwrstation-prod"
    to_s3_bucket = "pwrstation-staging"
    access_key_id = Rails.application.credentials.dig(:aws, :access_key_id)
    secret_access_key = Rails.application.credentials.dig(:aws, :secret_access_key)
    system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 rm s3://#{to_s3_bucket} --recursive")
    system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 sync s3://#{from_s3_bucket} s3://#{to_s3_bucket}")
  end

  desc "Deprecated: Sync files from Production S3 bucket to Staging S3 bucket"
  task s3_to_prod: :environment do
    puts "POST-MVP can only move from prod to staging"
    # from_s3_bucket = "pwrstation-staging"
    # to_s3_bucket = "pwrstation-prod"
    # access_key_id = Rails.application.credentials.dig(:aws, :access_key_id)
    # secret_access_key = Rails.application.credentials.dig(:aws, :secret_access_key)
    # system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 rm s3://#{to_s3_bucket} --recursive")
    # system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 sync s3://#{from_s3_bucket} s3://#{to_s3_bucket}")
  end

  desc "Salesforce: copy table data into csv and upload it to the webdev user"
  task backup_sf_tables: :environment do
    BackupSalesforceDataJob.perform_later
  end

  desc "Honeybadger Check In"
  task honeybadger_salesforce_check_in: :environment do
    sh "curl https://api.honeybadger.io/v1/check_in/5mIjyd"
  end

  desc "Tracker Sync Feedback Progress"
  task pivotal_tracker_feedback_progress_sync: :environment do
    Feedback.where.not(tracker_id: nil).pluck(:id).each do |feedback_id|
      TrackerSyncJob.perform_later(feedback_id)
    end
  end

  desc "Update user job_position"
  task pending_job_position: :environment do
    PendingJobPosition.where(status: "approved", effective_at: Date.today).pluck(:id).each do |pending_job_id|
      PendingJobPositionsJob.perform_later(pending_job_id)
    end
  end
end
