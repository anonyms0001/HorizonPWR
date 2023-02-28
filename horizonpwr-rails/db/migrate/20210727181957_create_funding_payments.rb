class CreateFundingPayments < ActiveRecord::Migration[6.1]
  def change
    create_table :funding_payments do |t|
      t.datetime :received_at
      t.decimal :amount
      t.integer :position
      t.references :funding, null: false, foreign_key: true

      t.timestamps
    end
  end
end
