# To deliver this notification:
#
# ApplicantNotification.with(post: @post).deliver_later(current_user)
# ApplicantNotification.with(post: @post).deliver(current_user)

class ApplicantNotification < ApplicationNotification
  # Database delivery is already added in ApplicationNotification

  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"
  deliver_by :email, mailer: "ApplicantMailer", method: :onboard_applicant, if: :manually_onboarded?
  deliver_by :email, mailer: "ApplicantMailer", method: :new_applicant, unless: :manually_onboarded?

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
    t("notifications.applicant_notification.message", applicant_name: applicant.name, job_position_name: job_position_name, link: url)
  end

  def subject
    t("notifications.applicant_notification.subject", job_position_name: job_position_name, link: url)
  end

  def applicant
    Applicant.find(params[:applicant].id)
  end

  def job_position_name
    JobPosition.find(params[:applicant].job_position_id).name.downcase
  end

  def applicant_team?
    !!params[:applicant][:account_id]
  end

  def manually_onboarded?
    !!params[:applicant][:created_by_id]
  end

  def user
    params[:user]
  end

  def url
    # You can use any URL helpers here such as:
    # post_path(params[:post])
    applicant_path(params[:applicant])
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
