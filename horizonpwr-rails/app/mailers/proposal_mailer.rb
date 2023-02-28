class ProposalMailer < ApplicationMailer
  default from: "no_reply@panel.horizonpwr.com"
  # layout 'mailer'
  def block_notification_email
    @proposal = params[:proposal]
    @blocked_by = params[:blocked_by]
    @user = @proposal.appointment.created_by
    @contact = @proposal.appointment.contacts.first
    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@user.email, @user.name),
      subject: "The Proposal for #{@proposal.appointment.contacts&.first&.name} has an issue with #{@proposal&.blocked_on&.downcase}"
    )
  end

  def completed_email
    @proposal = params[:proposal]
    @user = @proposal.appointment.scheduled_with_consultant
    @contact = @proposal.appointment.contacts.first
    @url = proposal_url(@proposal)
    if @proposal.attachments.attached? && (@proposal.attachments.map(&:byte_size).sum * 0.000001) <= 8.0
      @proposal.attachments.each do |attachment|
        @filename = attachment.filename.to_s
        if ActiveStorage::Blob.service.respond_to?(:path_for)
          attachments.inline[@filename] = File.read(ActiveStorage::Blob.service.send(:path_for, attachment.key))
        elsif ActiveStorage::Blob.service.respond_to?(:download)
          attachments.inline[@filename] = attachment.download
        end
      end
    end
    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@user.email, @user.name),
      # TODO: We may want to format the start_at date so that the entire DateTime object isn't displayed.
      subject: "Proposal Ready: #{@contact.name} - #{@proposal.appointment.start_at}"
    )
  end

  def duplicate_proposal_email
    @proposal_ids = params[:proposal_ids]
    @proposal = Proposal.find(@proposal_ids.max)
    @user = @proposal.appointment.created_by
    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@user.email, @user.name),
      subject: "Duplicate proposals have been created!"
    )
  end
end
