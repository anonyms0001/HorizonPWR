class AddArchivedToTables < ActiveRecord::Migration[6.1]
  def change
    add_column :appointments, :archived, :boolean, default: false, null: false
    add_column :proposals, :archived, :boolean, default: false, null: false
    add_column :users, :archived, :boolean, default: false, null: false
    add_column :contacts, :archived, :boolean, default: false, null: false
    add_column :addresses, :archived, :boolean, default: false, null: false
    add_column :projects, :status, :string, default: "new"
  end
end
