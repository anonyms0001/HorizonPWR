class AddColumnsToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :personal_email, :string
    add_column :users, :phone, :string
    add_column :users, :end_reason, :string
  end
end
