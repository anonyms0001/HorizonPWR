class CreateEarningRates < ActiveRecord::Migration[6.1]
  def change
    create_table :earning_rates do |t|
      t.decimal :amount, null: false
      t.integer :range_top
      t.integer :range_bottom
      t.references :earning_type, null: false, foreign_key: true
      t.boolean :active, default: true
      t.references :job_position, null: false, foreign_key: true

      t.timestamps
    end
  end
end
