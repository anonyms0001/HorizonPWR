class CreateReferrals < ActiveRecord::Migration[6.1]
  def change
    create_table :referrals do |t|
      t.references :referrer_contact, foreign_key: {to_table: :contacts}
      t.references :referral_contact, foreign_key: {to_table: :contacts}
      t.string :email, null: false
      t.string :phone
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.references :contest, foreign_key: true
      t.string :referrer_name
      t.string :status, null: false, default: "to_contact"
      t.string :eligible, null: false, default: "unchecked"

      t.timestamps
    end
  end
end
