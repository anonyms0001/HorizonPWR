class AddInstallerAccountIdToAppointments < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def up
    add_reference :appointments, :installer_account, index: {algorithm: :concurrently}
  end

  def down
    remove_reference :appointments, :installer_account, index: false
  end
end
