# Preview all emails at http://localhost:5000/rails/mailers/proposal_mailer
class ProposalMailerPreview < ActionMailer::Preview
  def block_notification_email
    ProposalMailer.with(proposal: Proposal.where(blocked: true).last, blocked_by: User.find_by(email: "ben.sanchez@horizonpwr.com")).block_notification_email
  end
end
