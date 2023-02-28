class AddDailyUsageToEnergyConsumptions < ActiveRecord::Migration[6.1]
  def change
    add_column :energy_consumptions, :daily_usage, :text, default: [].to_yaml
  end
end
