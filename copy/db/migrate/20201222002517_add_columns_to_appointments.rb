class AddColumnsToAppointments < ActiveRecord::Migration[6.0]
  def change
    safety_assured do
      add_reference :appointments, :project, foreign_key: {to_table: :projects}
      add_reference :appointments, :created_by_position, foreign_key: {to_table: :job_positions}
    end
  end
end
