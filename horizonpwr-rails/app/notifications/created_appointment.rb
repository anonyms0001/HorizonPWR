# To deliver this notification:
#
# CreatedAppointment.with(post: @post).deliver_later(current_user)
# CreatedAppointment.with(post: @post).deliver(current_user)

class CreatedAppointment < ApplicationNotification
  # Database delivery is already added in ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"
  # deliver_by :email, mailer: "AppointmentMailer", method: :appointment_created_email
  # Add your delivery methods
  #
  # deliver_by :email, mailer: "UserMailer"
  # deliver_by :slack
  # deliver_by :custom, class: "MyDeliveryMethod"

  # Add required params
  #
  # param :post

  # Define helper methods to make rendering easier.
  #
  # `message` and `url` are used for rendering in the navbar

  def message
    t("notifications.created_appointment.message", appointment_date: appointment.start_at.strftime("%b %e, %Y"), link: url)
  end

  def subject
    t("notifications.created_appointment.subject", appointment_date: appointment.start_at.strftime("%b %e, %Y"))
  end

  def appointment
    Appointment.find(params[:appt].id)
  end

  # def contact
  #   proposal.contacts.first
  # end

  def url
    # You can use any URL helpers here such as:
    appointment_path(params[:appt])
    # root_path
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
