class AddCompletedAtToAppointments < ActiveRecord::Migration[6.1]
  def change
    add_column :appointments, :completed_at, :datetime
  end
end
