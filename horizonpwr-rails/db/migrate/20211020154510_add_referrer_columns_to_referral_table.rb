class AddReferrerColumnsToReferralTable < ActiveRecord::Migration[6.1]
  def up
    safety_assured { remove_column :referrals, :referrer_name }
    add_column :referrals, :referrer_first_name, :string
    add_column :referrals, :referrer_last_name, :string
    add_column :referrals, :referrer_address, :string
    add_column :referrals, :referrer_phone, :string
    add_column :referrals, :referrer_email, :string
    add_column :referrals, :user_id, :integer
  end
end
