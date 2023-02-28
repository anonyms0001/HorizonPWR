class AddActiveToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :active, :boolean, default: false
    add_column :users, :position, :string
    add_column :users, :start_date, :date
    add_column :users, :birth_date, :date
    add_column :users, :end_date, :date
    add_column :users, :shirt_size, :string
    add_column :users, :shoe_size, :string

    add_column :accounts, :active, :boolean, default: false
  end
end
