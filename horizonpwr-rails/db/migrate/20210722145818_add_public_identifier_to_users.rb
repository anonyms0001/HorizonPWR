class AddPublicIdentifierToUsers < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def up
    add_column :users, :secure_public_id, :string, if_not_exists: true
    add_index :users, :secure_public_id, unique: true, algorithm: :concurrently, if_not_exists: true

    User.find_each(&:regenerate_secure_public_id)

    add_column :applicants, :secure_public_id, :string, if_not_exists: true
    add_column :applicants, :new_email, :string, if_not_exists: true
    add_index :applicants, :secure_public_id, unique: true, algorithm: :concurrently, if_not_exists: true

    Applicant.find_each(&:regenerate_secure_public_id)
  end

  def down
    remove_index :users, :secure_public_id, unique: true, if_exists: true
    remove_index :applicants, :secure_public_id, unique: true, if_exists: true

    remove_column :users, :secure_public_id, if_exists: true
    remove_column :applicants, :secure_public_id, if_exists: true
    remove_column :applicants, :new_email, if_exists: true
  end
end
