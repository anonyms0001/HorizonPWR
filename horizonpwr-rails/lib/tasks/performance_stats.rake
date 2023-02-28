namespace :performance_stats do
  desc "performance stats"
  task create: :environment do
    puts "creating stats for active sales accounts"
    datetime = Time.current.getutc.beginning_of_week
    while datetime > "2021-01-01".to_datetime.getutc
      Account.active_sales_accounts.find_each do |accountable|
        PerformanceStat.find_or_create_week_stat(accountable, datetime)
      end
      print "."
      datetime -= 1.week
    end
  end

  task recreate: :environment do
    count = PerformanceStat.delete_all
    puts "Purged #{count} performance stats"
    system! "rails performance_stats:create"
  end

  task sync_installer_stats: :environment do
    puts "Syncing Installer Stats"
    SalesforceClient.new.update_installer_stats
    puts "Syncing Installer Stats Complete"
  end
end
