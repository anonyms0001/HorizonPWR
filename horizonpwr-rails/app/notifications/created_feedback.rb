# To deliver this notification:
#
# CreatedFeedback.with(post: @post).deliver_later(current_user)
# CreatedFeedback.with(post: @post).deliver(current_user)

class CreatedFeedback < ApplicationNotification
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
  def subject
    t("notifications.created_feedback.subject", feedback_author: feedback_author, link: url)
  end

  # `message` and `url` are used for rendering in the navbar
  def message
    t("hello")
    t("notifications.created_feedback.message")
  end

  def feedback
    Feedback.find(params[:feedback].id)
  end

  def feedback_author
    feedback.user.name
  end

  def url
    # You can use any URL helpers here such as:
    # post_path(params[:post])
    feedback_path(params[:feedback])
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
