class ModifyAppointments < ActiveRecord::Migration[6.1]
  def up
    safety_assured do
      add_column :appointments, :start_at, :datetime
      add_column :appointments, :end_at, :datetime
      Appointment.update_all("start_at = date, end_at = date")
      remove_column :appointments, :date
    end
  end

  def down
    safety_assured do
      add_column :appointments, :date, :datetime
      Appointment.update_all("date = start_at")
      remove_column :appointments, :start_at
      remove_column :appointments, :end_at
    end
  end
end
