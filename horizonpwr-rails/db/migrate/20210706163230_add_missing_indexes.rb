class AddMissingIndexes < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def change
    # NOTE: Commented lines already exist, according to the schema, even though it doesn't look like it in Postico.

    add_index :addresses, :salesforce_lead_id, algorithm: :concurrently
    add_index :addresses, :salesforce_opportunity_id, algorithm: :concurrently
    add_index :addresses, :canvass_address_id, algorithm: :concurrently

    # add_index :adjustments, :earning_id, algorithm: :concurrently
    # add_index :adjustments, :adjustment_id, algorithm: :concurrently

    add_index :appointments, :salesforce_opportunity_id, algorithm: :concurrently
    add_index :appointments, :salesforce_residential_project_id, algorithm: :concurrently
    add_index :appointments, :canvass_appointment_id, algorithm: :concurrently

    add_index :contacts, :salesforce_lead_id, algorithm: :concurrently
    add_index :contacts, :salesforce_opportunity_id, algorithm: :concurrently
    add_index :contacts, :canvass_contact_id, algorithm: :concurrently

    # add_index :events, :eventable_id, algorithm: :concurrently

    # add_index :form_configs, :dynamic_form_id, algorithm: :concurrently

    # add_index :form_responses, [:respondable_type, :respondable_id], algorithm: :concurrently

    add_index :installers, :salesforce_installer_id, algorithm: :concurrently

    # add_index :notes, [:notable_type, :notable_id], algorithm: :concurrently

    # add_index :payout_line_items, [:itemable_type, :itemable_id], algorithm: :concurrently

    # add_index :project_feeds, [:project_feedable_type, :project_feedable_id], algorithm: :concurrently

    add_index :projects, :salesforce_residential_project_id, algorithm: :concurrently
    add_index :projects, :salesforce_opportunity_id, algorithm: :concurrently
    # add_index :projects, :address_id, algorithm: :concurrently

    # add_index :proposals, :address_id, algorithm: :concurrently
  end
end
