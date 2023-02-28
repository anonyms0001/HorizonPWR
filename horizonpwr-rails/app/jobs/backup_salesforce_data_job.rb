class BackupSalesforceDataJob < ApplicationJob
  queue_as :default

  def perform(*args)
    %i[account lead opportunity project].each do |table|
      SalesforceClient.new.generate_backup_csv(table.to_s)
    end
    system("rails data:honeybadger_salesforce_check_in")
  end
end
