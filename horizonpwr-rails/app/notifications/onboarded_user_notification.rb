# To deliver this notification:
#
# OnboardedUserNotification.with(post: @post).deliver_later(current_user)
# OnboardedUserNotification.with(post: @post).deliver(current_user)

class OnboardedUserNotification < ApplicationNotification
  # Database delivery is already added in ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"

  # Add your delivery methods
  #
  # deliver_by :email, mailer: "OnboardedUserMailer"
  # deliver_by :slack
  # deliver_by :custom, class: "MyDeliveryMethod"

  # Add required params
  #
  # param :post
  param :user

  # Define helper methods to make rendering easier.
  #
  # `message` and `url` are used for rendering in the navbar

  def message
    "#{params[:user].name} says they have completed the onboarding checklist"
  end

  def subject
    "Applicant ready for Onboarding"
  end

  def url
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
