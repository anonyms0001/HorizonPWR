class UpcomingAppointmentsJob < ApplicationJob
  queue_as :default

  def perform(*args)
    # time = Time.now.utc + 3.hours
    # appointments = Appointment.where(start_at: time.beginning_of_hour..time.end_of_hour)
    # # appointments = Appointment.where('created_by_id IS NOT NULL AND scheduled_with_id IS NOT NULL AND date BETWEEN ? AND ?', DateTime.now.beginning_of_day, DateTime.now.end_of_day)
    # if appointments.count > 0
    #   appointments.each_with_index do |appointment, index|
    #     UpcomingAppointment.with(appt: appointment, customer: appointment.name).deliver_later(appointment.scheduled_with) # TODO: Replace customer placeholder with the correct association of customer and appointment
    #     URI.open("https://api.honeybadger.io/v1/check_in/b3IAk6")
    #   end
    # end
  end
end

# Sidekiq::Cron::Job.create(name: "Upcoming Appointments - every 1hour", cron: "0 * * * *", class: "UpcomingAppointmentsJob")
