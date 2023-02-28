class AddSecurePublicContacts < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def up
    add_column :contacts, :secure_public_id, :string, if_not_exists: true
    add_index :contacts, :secure_public_id, unique: true, algorithm: :concurrently, if_not_exists: true

    Contact.find_each(&:regenerate_secure_public_id)
  end

  def down
    remove_index :contacts, :secure_public_id, unique: true, if_exists: true
    remove_column :contacts, :secure_public_id, if_exists: true
  end
end
