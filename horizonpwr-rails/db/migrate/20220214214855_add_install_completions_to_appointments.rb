class AddInstallCompletionsToAppointments < ActiveRecord::Migration[6.1]
  def change
    add_column :appointments, :task_completion, :jsonb, null: false, default: {}
  end
end
