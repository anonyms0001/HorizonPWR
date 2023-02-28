# To deliver this notification:
#
# CompletedProject.with(post: @post).deliver_later(current_user)
# CompletedProject.with(post: @post).deliver(current_user)

class CompletedProject < ApplicationNotification
  # Database delivery is already added in ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"
  # deliver_by :email, mailer: "ProjectMailer", method: :completed_email
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
    t("notifications.project_notification.message", contact_name: project.address.contacts.first.name, link: url)
  end

  def subject
    t("notifications.project_notification.subject", contact_name: project.address.contacts.first.name, link: url)
  end

  def project
    Project.find(params[:proj].id)
  end

  def url
    # You can use any URL helpers here such as:
    # post_path(params[:post])
    project_path(params[:proj])
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
