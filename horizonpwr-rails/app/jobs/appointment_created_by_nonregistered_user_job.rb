class AppointmentCreatedByNonregisteredUserJob < ApplicationJob
  queue_as :default

  def perform(json)
    Honeybadger.context({json: json})
    user = User.find_by!(email: json["email"].downcase)
    # appointment = Appointment.find_by!(canvass_appointment_id: params["data"]["appointment"]["id"])
    user.link_applicant
    user.update(canvass_user_id: json["id"]) if user.canvass_user_id.nil?
    # TODO: This is by no means done or ready. This was originally only taking in 1 appointment and then updating that one.
    # with the limited context, I updated it to pull in all of that user's appointments, which would be terrible for pay
    # So I am turning off creating a quality sit earning for now until we find a better solution.
    #
    # appointment = Appointment.find_by!(canvass_appointment_id: params["data"]["appointment"]["id"])
    if user.present?
      appointments = CanvassClient.new.employee_appointments_get(json["id"])
      appointments.each do |appointment|
        if appointment == Appointment.find_by(canvass_appointment_id: appointment["id"])
          ActiveRecord::Base.transaction do
            # Earning.create_quality_sit(appointment)
            appointment.update(created_by: user)
            # appointment.create_quality_sit
          end
        end
      end
    end
  end
end
