class CanvassNonregisteredUserMailer < ApplicationMailer
  def invite
    @applicant = params[:applicant]
    @applicant_name = @applicant.first_name + " " + @applicant.last_name
    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@applicant.new_email, @applicant_name),
      subject: "You need to register your PWRStation Account"
    )
  end
end
