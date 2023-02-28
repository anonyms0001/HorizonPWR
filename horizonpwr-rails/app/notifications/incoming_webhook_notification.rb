# To deliver this notification:
#
# IncomingWebhookNotification.with(post: @post).deliver_later(current_user)
# IncomingWebhookNotification.with(post: @post).deliver(current_user)

class IncomingWebhookNotification < ApplicationNotification
  # Database delivery is already added in ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"
  # deliver_by :email, mailer: "ProposalMailer", method: :duplicate_proposal_email

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

  def proposal_ids
    params[:proposal_ids]
  end

  def subject
    "Duplicate Proposal"
  end

  def message
    t("duplicate_proposals", proposal_ids: proposal_ids)
  end

  def url
    # You can use any URL helpers here such as:
    # post_path(params[:post])
    proposal_path(proposal_ids.max)
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end

  after_deliver do
    # Anything you want
  end
end
