class CreateAdjustments < ActiveRecord::Migration[6.1]
  def change
    create_table :adjustments do |t|
      t.decimal :amount, null: false

      t.timestamps
    end
  end
end
