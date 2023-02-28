class CreateEnergyConsumptions < ActiveRecord::Migration[6.1]
  def change
    create_table :energy_consumptions do |t|
      t.text :monthly_usage, default: [].to_yaml
      t.references :proposal, null: false, foreign_key: true
      t.references :updated_by, foreign_key: {to_table: :users}
      t.references :created_by, foreign_key: {to_table: :users}
      t.string :data_source

      t.timestamps
    end
  end
end
