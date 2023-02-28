class AddEndReasonToUsers < ActiveRecord::Migration[6.1]
  def change
    safety_assured do
      add_reference :users, :job_position
      add_column :users, :salesforce_account_id, :string
      add_column :users, :extra_salesforce_account_ids, :text, array: true, default: []

      add_column :projects, :salesforce_residential_project_id, :string
      add_column :projects, :salesforce_opportunity_id, :string
      add_reference :projects, :address

      add_column :contacts, :salesforce_lead_id, :string
      add_column :contacts, :salesforce_opportunity_id, :string
      add_column :contacts, :lead_source, :string
      add_column :contacts, :phone1, :string

      add_column :addresses, :salesforce_lead_id, :string
      add_column :addresses, :salesforce_opportunity_id, :string
      add_column :addresses, :street, :string
      add_column :addresses, :city, :string
      add_column :addresses, :state, :string
      add_column :addresses, :postal_code, :string

      add_column :appointments, :salesforce_opportunity_id, :string
      add_column :appointments, :salesforce_residential_project_id, :string

      add_column :installers, :salesforce_installer_id, :string
    end
  end
end
