class AddAppointmentIdToAppointments < ActiveRecord::Migration[6.1]
  def change
    safety_assured do
      add_reference :appointments, :consult, foreign_key: {to_table: :appointments}

      Appointment.where(appointment_type: "consult").update_all("consult_id = id")
      Appointment.where.not(appointment_type: "consult").find_each do |appointment|
        appointment.consult ||= appointment.project&.appointments&.leads&.last
        appointment.save
      end
    end
  end
end
