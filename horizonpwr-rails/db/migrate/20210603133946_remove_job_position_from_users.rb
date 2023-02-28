class RemoveJobPositionFromUsers < ActiveRecord::Migration[6.1]
  def change
    # remove_column :plans, :trial_period_days
    safety_assured { remove_column :users, :position }
  end
end
