class GenerateSfCsvJob < ApplicationJob
  queue_as :default

  def perform(*args)
    SalesforceClient.new.generate_csv
  end
end
