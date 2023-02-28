class AppointmentMailer < ApplicationMailer
  default from: "no_reply@panel.horizonpwr.com"
  # layout 'mailer'
  def appointment_created_email
    @appointment = params[:appt]
    @customer = params[:customer]
    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@appointment.scheduled_with.email, @appointment.scheduled_with.name),
      subject: "New Appointment with #{@customer} for #{@appointment.date.strftime("%b %e, %Y, %l:%M %P")}"
    )
  end

  def upcoming_appointment_email
    @appointment = params[:appt]
    @customer = params[:customer]
    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@appointment.scheduled_with.email, @appointment.scheduled_with.name),
      subject: "Upcoming Appointment with #{@customer} for #{@appointment.date.strftime("%b %e, %Y, %l:%M %P")}"
    )
  end
end
