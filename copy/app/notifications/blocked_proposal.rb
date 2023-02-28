# To deliver this notification:
#
# BlockedProposal.with(post: @post).deliver_later(current_user)
# BlockedProposal.with(post: @post).deliver(current_user)

class BlockedProposal < ApplicationNotification
  # Database delivery is already added in ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"
  deliver_by :email, mailer: "ProposalMailer", method: :block_notification_email # , format: :format_for_email#, if: :email_notifications?

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
    t("notifications.blocked_proposal.message", contact_name: contact.name, blocked_on: proposal.blocked_on, appointment_date: date_mdy(proposal.appointment.date), link: url)
  end

  def subject
    t("notifications.blocked_proposal.subject", contact_name: contact.name, appointment_date: date_mdy(proposal.appointment.date))
  end

  def proposal
    Proposal.find(params[:proposal].id) # TODO: This param is not alwasys passed we need to find a way to get the proposal without the param
  end

  def contact
    proposal.contacts.first
  end

  def url
    # You can use any URL helpers here such as:
    proposal_path(params[:proposal])
    # root_path
  end

  # Include account_id to make sure notification only triggers if user is signed in to that account
  def to_websocket
    {
      # account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end
end
