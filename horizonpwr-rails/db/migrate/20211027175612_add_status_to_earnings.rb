class AddStatusToEarnings < ActiveRecord::Migration[6.1]
  def change
    add_column :earnings, :status, :string, null: false, default: "pending"
  end
end
