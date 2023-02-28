class AcceptedInvite < ApplicationNotification
  deliver_by :action_cable, format: :to_websocket, channel: "NotificationChannel"

  def to_websocket
    {
      # account_id: record.account_id,
      html: ApplicationController.render(partial: "notifications/notification", locals: {notification: record})
    }
  end

  def message
    t "notifications.invite_accepted", user: user.name
  end

  def subject
    I18n.t("account_invitations_mailer.invite.subject", inviter: user.name, account: record.account)
  end

  def url
    account_path(record.account)
  end

  def user
    params[:user]
  end
end
