# To deliver this notification:
#
# InstallDateChangeNotification.with(post: @post).deliver_later(current_user)
# InstallDateChangeNotification.with(post: @post).deliver(current_user)

class InstallDateChangeNotification < ApplicationNotification
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
  # param :old_start_at
  # param :new_start_at
  # param :appointment

  # Define helper methods to make rendering easier.
  #
  # `message` and `url` are used for rendering in the navbar

  def message
    t "install_date_changed", old_start_at: params[:old_start_at], new_start_at: params[:new_start_at]
  end

  def subject
    "An install date has changed."
  end

  def appointment
    Appointment.find(params[:appointment])
  end

  def url
    # You can use any URL helpers here such as:
    # post_path(params[:post])
    appointment_path(params[:appointment])
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
