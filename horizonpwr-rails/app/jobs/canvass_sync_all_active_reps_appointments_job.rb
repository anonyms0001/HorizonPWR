class CanvassSyncAllActiveRepsAppointmentsJob < ApplicationJob
  queue_as :default

  def perform
    users = User.sales.active.where.not(canvass_user_id: [nil, ""])

    users.each do |user|
      rep_appointments = CanvassClient.new.employee_appointments_get(user.canvass_user_id)
      Honeybadger.context({rep_appointments: rep_appointments, user: user})
      if rep_appointments.size > 1
        future_appointments = rep_appointments.select { |appointment|
          appointment["start"] >= DateTime.now.beginning_of_day - 1.days
        }
        future_appointments.each do |future_appointment|
          CanvassAppointmentSyncJob.perform_later(future_appointment)
        end
      end
      # TODO: StandardRB says "Lint/RescueException: Avoid rescuing the `Exception` class. Perhaps you meant to rescue `StandardError`?"
    rescue Exception => e
      Honeybadger.notify(e)
    end
  end
end
