class AddCanvassUserActiveToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :canvass_user_active, :boolean
  end
end
