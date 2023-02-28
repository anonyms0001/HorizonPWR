class AddUserToEarnings < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def up
    safety_assured do
      Earning.delete_all
      PayoutRateVariant.delete_all
      PayoutLineItem.delete_all
      Payout.delete_all
      add_column :earnings, :user_id, :bigint
      add_column :earnings, :appointment_id, :bigint
      User.update_all("job_position_id = 1 WHERE users.job_position_id IS null")
      User.where(start_date: nil).update_all("start_date = '#{3.months.ago}'")

      add_foreign_key :earnings, :users, validate: true
      add_foreign_key :earnings, :appointments, validate: true
      add_index :earnings, :user_id
      add_index :earnings, :appointment_id
    end
  end

  def down
    remove_index :earnings, :user_id, if_exists: true
    remove_column :earnings, :user_id, :bigint, if_exists: true
    remove_index :earnings, :appointment_id, if_exists: true
    remove_column :earnings, :appointment_id, :bigint, if_exists: true
  end
end

# Add user to earnings
# initialize payoutratevariant from an earning
# initialize a payout from a payout rate variant
