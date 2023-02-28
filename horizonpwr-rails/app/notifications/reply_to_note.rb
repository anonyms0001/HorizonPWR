# To deliver this notification:
#
# ReplyToNote.with(post: @post).deliver_later(current_user)
# ReplyToNote.with(post: @post).deliver(current_user)

class ReplyToNote < ApplicationNotification
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
    t("notifications.reply_to_note.message", user_name: user_name)
  end

  def subject
    t("notifications.reply_to_note.subject")
  end

  # TODO: Refactor, I just used the same logic from url so I wouldn't look more into it.
  def user_name
    parent_record_id = params[:parent_record_id] if params[:parent_record_id].present?
    if params[:parent_record_type] == Note
      parent_record = Note.find(parent_record_id)
      parent_record.user.name
    elsif params[:parent_record_type] == Feedback
      parent_record = Feedback.find(parent_record_id)
      parent_record.user.name
    else
      "Someone"
    end
    # TODO: Refactor to handle requests where the parent record id is not provided
    parent_record ? parent_record.user.name : "Undefined"
  end

  def url
    parent_record_id = params[:parent_record_id] if params[:parent_record_id].present?
    if params[:parent_record_type] == Note
      parent_record = Note.find(parent_record_id)
      note_path(parent_record)
    elsif params[:parent_record_type] == Feedback
      parent_record = Feedback.find(parent_record_id)
      feedback_path(parent_record)
    else
      root_path
    end
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
