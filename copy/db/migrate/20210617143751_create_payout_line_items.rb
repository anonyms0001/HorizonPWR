class CreatePayoutLineItems < ActiveRecord::Migration[6.1]
  def change
    create_table :payout_line_items do |t|
      t.references :payout, null: false, foreign_key: true
      t.references :itemable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
