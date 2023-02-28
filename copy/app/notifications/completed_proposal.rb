# To deliver this notification:
#
# CompletedProposal.with(post: @post).deliver_later(current_user)
# CompletedProposal.with(post: @post).deliver(current_user)
class CompletedProposal < ApplicationNotification
  # Database delivery is already added in ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"
  deliver_by :email, mailer: "ProposalMailer", method: :completed_email # , format: :format_for_email#, if: :email_notifications?

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
    t("notifications.completed_proposal.message", contact_name: contact.name, appointment_date: date_mdy(proposal.appointment.date), link: url)
  end

  def subject
    t("notifications.completed_proposal.subject", contact_name: contact.name, appointment_date: date_mdy(proposal.appointment.date))
  end
  # def format_for_email
  #
  # end

  def proposal
    Proposal.find(params[:proposal].id)
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
