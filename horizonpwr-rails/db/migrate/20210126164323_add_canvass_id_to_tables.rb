class AddCanvassIdToTables < ActiveRecord::Migration[6.1]
  def change
    add_column :contacts, :canvass_contact_id, :string
    add_column :contacts, :birth_date, :datetime
    add_column :contacts, :gender, :boolean
    add_column :addresses, :canvass_address_id, :string
    add_column :appointments, :canvass_appointment_id, :string

    add_column :users, :canvass_user_id, :string
    add_column :accounts, :canvass_team_id, :string
  end
end
