# To deliver this notification:
#
# DeactivateUserNotification.with(post: @post).deliver_later(current_user)
# DeactivateUserNotification.with(post: @post).deliver(current_user)

class DeactivateUserNotification < ApplicationNotification
  # Database delivery is already added in ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"

  # Add your delivery methods
  #
  deliver_by :email, mailer: "DeactivateUserMailer", method: :deactivation_email
  # deliver_by :slack
  # deliver_by :custom, class: "MyDeliveryMethod"

  # Add required params
  #
  # param :post

  # Define helper methods to make rendering easier.
  #
  # `message` and `url` are used for rendering in the navbar

  def message
    "#{params[:requested_by].name} Requested De-Activation of #{params[:user].name}"
  end

  def subject
    "Deactivation Request"
  end

  def url
    # You can use any URL helpers here such as:
    # post_path(params[:post])
    user_path(params[:user])
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
