class DuplicateProposalsMgrJob < ApplicationJob
  queue_as :default

  def perform(*args)
    if Proposal.where(id: proposals.pluck(:id)).count > 1
      # TODO: The deliver_later argument is insane here. Can it be improved?
      # IncomingWebhookNotification.with(proposal_ids: proposals.pluck(:id)).deliver_later(proposals.first.appointment.created_by.accounts.impersonal.first.owner)
    end
  end
end
