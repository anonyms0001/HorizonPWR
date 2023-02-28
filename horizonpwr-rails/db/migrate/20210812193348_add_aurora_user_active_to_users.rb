class AddAuroraUserActiveToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :aurora_user_active, :boolean
  end
end
