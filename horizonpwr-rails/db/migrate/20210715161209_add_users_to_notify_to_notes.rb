class AddUsersToNotifyToNotes < ActiveRecord::Migration[6.1]
  def up
    add_column :notes, :users_to_notify, :text, default: [].to_yaml
  end

  def down
    remove_column :notes, :users_to_notify, :text
  end
end
