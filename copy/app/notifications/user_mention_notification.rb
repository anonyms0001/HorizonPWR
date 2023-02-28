# To deliver this notification:
#
# UserMentionNotification.with(post: @post).deliver_later(current_user)
# UserMentionNotification.with(post: @post).deliver(current_user)

class UserMentionNotification < ApplicationNotification
  # Database delivery is already added in ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"
  deliver_by :email, mailer: "NoteMailer", method: :user_mention

  # Add your delivery methods
  #
  # deliver_by :email, mailer: "UserMailer"
  # deliver_by :slack
  # deliver_by :custom, class: "MyDeliveryMethod"

  # Add required params
  #
  param :note

  # Define helper methods to make rendering easier.
  #
  # `message` and `url` are used for rendering in the navbar

  def message
    t("notifications.user_mention_notification.message")
  end

  def subject
    t("notifications.user_mention_notification.subject")
  end

  def note
    Note.find(params[:note].id)
  end

  def url
    # You can use any URL helpers here such as:
    # post_path(params[:post])
    note_path(note.parent_record, anchor: "note_#{note.id}")
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
