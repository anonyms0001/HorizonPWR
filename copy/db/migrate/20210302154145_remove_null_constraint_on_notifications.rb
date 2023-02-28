class RemoveNullConstraintOnNotifications < ActiveRecord::Migration[6.1]
  def change
    change_column_null :notifications, :account_id, true
  end
end
