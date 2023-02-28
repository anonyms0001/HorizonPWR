# Preview all emails at http://localhost:3000/rails/mailers/onboarded_user_mailer
class OnboardedUserMailerPreview < ActionMailer::Preview
  def password_reset_email
    OnboardedUserMailer.with(user: User.first).password_reset_email
  end
end
