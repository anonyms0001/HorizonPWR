# To deliver this notification:
#
# InstallCompletionNotification.with(post: @post).deliver_later(current_user)
# InstallCompletionNotification.with(post: @post).deliver(current_user)

class InstallCompletionNotification < ApplicationNotification
  # Database delivery is already added in ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"

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
    "The #{appointment.appointment_type} appointment for #{appointment.name} at #{appointment.address.address} was completed at #{appointment.completed_at.strftime("%l:%M %p %b. %e, %Y")}."
  end

  def subject
    "Installation complete for #{appointment.address.address} (#{appointment.name})."
  end

  def appointment
    Appointment.find(params[:appointment_id])
  end

  def url
    # You can use any URL helpers here such as:
    # post_path(params[:post])
    # root_path
    appointment_path(appointment)
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
