class CreateEarnings < ActiveRecord::Migration[6.1]
  def change
    create_table :earnings do |t|
      t.references :downline_earning, foreign_key: {to_table: :earnings}
      t.references :payout_rate_variant, null: false, foreign_key: true
      t.references :address, null: false, foreign_key: true
      t.references :project, foreign_key: true
      t.decimal :amount
      t.decimal :unit, null: false

      t.timestamps
    end
  end
end
