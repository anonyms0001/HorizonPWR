class NotificationsController < ApplicationController
  before_action :authenticate_user!

  def index
    notifications = current_user.notifications.where(recipient: current_user).newest_first
    notifications = current_user.notifications.where(recipient: current_user).newest_first.unread if !params[:filter].present? || params[:filter] == "unread"
    @pagy, @notifications = pagy(notifications)
  end

  def show
    @notification = current_user.notifications.find(params[:id])
    @notification.mark_thread_as_read!
    redirect_to @notification.to_notification.url
  end

  def mark_non_feedback_notifications_as_read
    Notification.where(recipient_id: current_user, read_at: nil).each do |notification|
      note = Note.find_by(id: notification.params[:parent_record_id])
      if note.present? && note.notable_type != "Feedback"
        notification.mark_as_read!
        # TODO: StandardRB says "Lint/UselessAssignment: Useless assignment to variable - `message`."
        message ||= "All projects notifications have been marked as read"
      end
    end
    message ||= "You do not have any project notifications"
    redirect_to notifications_path, notice: message
  end
end
