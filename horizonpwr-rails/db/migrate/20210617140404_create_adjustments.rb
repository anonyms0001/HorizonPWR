class CreateAdjustments < ActiveRecord::Migration[6.1]
  def change
    create_table :adjustments do |t|
      t.decimal :amount, null: false
      t.references :adjustable, polymorphic: true, null: false
      t.boolean :pay_back, default: false

      t.timestamps
    end
  end
end
