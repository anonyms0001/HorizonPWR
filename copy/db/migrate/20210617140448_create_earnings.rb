class CreateEarnings < ActiveRecord::Migration[6.1]
  def change
    create_table :earnings do |t|
      t.references :downline_earning, null: false, foreign_key: {to_table: :earnings}
      t.references :payout_rate_variant, null: false, foreign_key: true
      t.decimal :amount
      t.integer :unit, null: false

      t.timestamps
    end
  end
end
