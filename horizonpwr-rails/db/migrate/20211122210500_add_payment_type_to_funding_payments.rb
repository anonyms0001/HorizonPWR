class AddPaymentTypeToFundingPayments < ActiveRecord::Migration[6.1]
  def up
    add_column :funding_payments, :payment_type, :string, null: false
    safety_assured { remove_column :funding_payments, :position }
  end

  def down
    remove_column :funding_payments, :payment_type, :string
    add_column :funding_payments, :position, :integer
  end
end
