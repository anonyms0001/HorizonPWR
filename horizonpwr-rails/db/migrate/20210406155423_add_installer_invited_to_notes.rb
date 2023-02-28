class AddInstallerInvitedToNotes < ActiveRecord::Migration[6.1]
  def change
    add_column :notes, :installer_invited, :boolean, default: false
  end
end
