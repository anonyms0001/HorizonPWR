class CreatePayouts < ActiveRecord::Migration[6.1]
  def change
    create_table :payouts do |t|
      t.references :user, null: false, foreign_key: true
      t.date :pay_date, null: false
      t.integer :pay_total
      t.string :status, null: false, default: "pending"
      t.references :approved_by, foreign_key: {to_table: :users}
      t.datetime :approved_at
      t.references :paid_by, foreign_key: {to_table: :users}
      t.datetime :paid_at

      t.timestamps
    end
  end
end
