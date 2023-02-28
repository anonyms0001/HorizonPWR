class AddActiveCampaignIdToContacts < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def up
    add_column :contacts, :active_campaign_id, :integer, if_not_exists: true
    add_index :contacts, :active_campaign_id, unique: true, algorithm: :concurrently, if_not_exists: true
  end

  def down
    remove_index :contacts, :active_campaign_id, unique: true, if_exists: true
    remove_column :contacts, :active_campaign_id, if_exists: true
  end
end
