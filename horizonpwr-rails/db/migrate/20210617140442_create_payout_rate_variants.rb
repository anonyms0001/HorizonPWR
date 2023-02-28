class CreatePayoutRateVariants < ActiveRecord::Migration[6.1]
  def change
    create_table :payout_rate_variants do |t|
      t.references :payout, null: false, foreign_key: true
      t.references :earning_rate, null: false, foreign_key: true
      t.references :earning_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
