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

    desc "TODO"
    task transfer_all: :environment do
      system! "rake data:transfer_to_staging"
      system! "rake data:transfer_to_review"
    end

    desc "TODO"
    task transfer_to_review: :environment do
      system! "heroku maintenance:on -a pwrstation-review"
      system! "heroku pg:backups:capture -a pwrstation-staging"
      # system! 'heroku pg:reset -a pwrstation-review --confirm pwrstation-review'
      system! "heroku pg:copy pwrstation-staging::DATABASE_URL pwrstation-review::DATABASE_URL -a pwrstation-review --confirm pwrstation-review"
      system! "heroku run bin/rails db:migrate -a pwrstation-review"
      system! "rails data:s3_to_review"
      system! "heroku run bin/rails data:reset_pk_sequence --app pwrstation-review"
      system! "heroku maintenance:off -a pwrstation-review"
    end

    desc "TODO"
    task transfer_to_staging: :environment do
      system! "heroku maintenance:on -a pwrstation-staging"
      system! "heroku pg:backups:capture -a pwrstation-prod"
      # system! 'heroku pg:reset -a pwrstation-staging --confirm pwrstation-staging'
      system! "heroku pg:copy pwrstation-prod::DATABASE_URL pwrstation-staging::DATABASE_URL --app pwrstation-staging --confirm pwrstation-staging"
      system! "heroku run bin/rails db:migrate pwrstation-staging"
      system! "rails data:s3_to_staging"
      system! "heroku run bin/rails data:reset_pk_sequence --app pwrstation-staging"
      system! "heroku maintenance:off -a pwrstation-staging"
    end

    desc "TODO"
    task obfuscate_all: :environment do
      system! "heroku run rake data:obfuscate_review -a pwrstation-review"
      system! "heroku run rake data:obfuscate_staging -a pwrstation-review"
    end

    desc "TODO"
    task obfuscate_review: :environment do
      system! "heroku run rake data:obfuscate -a pwrstation-review"
    end

    desc "TODO"
    task obfuscate_staging: :environment do
      system! "heroku run rake data:obfuscate -a pwrstation-staging"
    end

    desc "TODO"
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

    desc "TODO"
    task refresh_local: :environment do
      system! "rails data:s3_to_local"
      system! "heroku pg:backups:capture --app pwrstation-review"
      system! "rm latest.dump"
      system! "heroku pg:backups:download --app pwrstation-review"
      system! "bin/rails db:environment:set RAILS_ENV=development"
      system! "bin/rails db:drop db:create db:migrate"
      system "pg_restore --verbose --clean --no-acl --no-owner -h localhost -d #{Rails.configuration.database_configuration["development"]["database"]} latest.dump"
      system! "bin/rails db:migrate"
      system! "bin/rails data:reset_pk_sequence"
      puts "\nYour local has the latest info from Review"
    end
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
  end

  desc "Sync files from Review S3 bucket to Staging S3 bucket"
  task s3_to_review: :environment do
    to_s3_bucket = "pwrstation-review"
    from_s3_bucket = "pwrstation-staging"
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
end
