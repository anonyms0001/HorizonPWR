class AddInstallerIdToAccounts < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def up
    add_reference :accounts, :installer, index: {algorithm: :concurrently}

    Installer.find_each do |installer|
      installer.accounts.create!(
        name: installer.name,
        owner: User.first,
        active: installer.active
      )
    end
  end

  def down
    Installer.find_each do |installer|
      installer.accounts.delete_all
    end

    remove_reference(:accounts, :installer, index: false)
  end
end
