# We got this from someone on the GoRails Slack.
# It is supposed to "turn all the data in your db into fixtures"

task extract_fixtures: :environment do
  sql = "SELECT * FROM %s"
  skip_tables = ["schema_info"]
  ActiveRecord::Base.establish_connection
  (ActiveRecord::Base.connection.tables - skip_tables).each do |table_name|
    i = "000"
    File.open("#{Rails.root}/test/fixtures/#{table_name}.yml", "w") do |file|
      data = ActiveRecord::Base.connection.select_all(sql % table_name)
      file.write data.each_with_object({}) { |record, hash|
        hash["#{table_name}_#{i.succ!}"] = record
      }.to_yaml
    end
  end
end
