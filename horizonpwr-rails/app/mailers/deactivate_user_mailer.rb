class DeactivateUserMailer < ApplicationMailer
  def deactivation_email
    @deactivate_user = params[:user]
    @requesting_user = params[:requested_by]
    @recipient = params[:recipient]

    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@recipient.email, @recipient.name),
      subject: "Deactivation Request"
    )
  end
end
