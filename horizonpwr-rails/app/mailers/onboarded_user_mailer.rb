class OnboardedUserMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.note_mailer.user_mention.subject
  #

  def password_reset_email
    # @terms_url = params[:terms_url]
    @user = params[:user]
    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@user.email, @user.name),
      subject: "Welcome To HorizonPWR"
    )
  end
end
