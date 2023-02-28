class NoteMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.note_mailer.user_mention.subject
  #

  def user_mention
    @note = params[:note]
    @user = params[:recipient]
    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@user.email, @user.name),
      subject: "[HZP] You have been mentioned in a Project Note."
    )
  end
end
