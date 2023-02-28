class DuplicateProposalsJob < ApplicationJob
  queue_as :default

  def perform(*args)
    Honeybadger.context({args: args})
    webhook = IncomingWebhook.find(args.first[:IncomingWebhook])
    payload = webhook.payload
    address = Address.find_by(canvass_address_id: payload["data"]["address"]["id"])
    return unless address.present?

    appointments = Appointment.where(
      appointment_type: "consult",
      appointment_status: ["scheduled", "rescheduled", "needs rescheduled", "blocked", "duplicate"], # not "canceled" or "no show"
      address_id: address.id,
      archived: false # Not previously deleted/archived
    ).where("start_at > ?", Date.today.beginning_of_day)

    proposals = Proposal.where(appointment_id: appointments.map(&:id))

    # Block em all, Just not ones that have moved beyond the new status.
    proposals.where(completion_state: "new").where.not(blocked: true).update_all(
      blocked: true,
      blocked_on: "Duplicate Proposal",
      reason_incomplete: "More than one appointment created in canvass"
    )

    # Archive deleted canvass appointments/proposals
    appointments.each do |appointment|
      canvass_appointment = CanvassClient.new.find_appointment(appointment.canvass_appointment_id)
      if canvass_appointment["message"] == "Invalid appointment_id"
        appointment.update(archived: true, appointment_status: "canceled")
        appointment.proposal.update(archived: true)
      end
    end

    # Unblock proposal/appointment
    active_appointments = appointments.where(archived: false)
    if active_appointments.size > 1
      DuplicateProposalsJob.set(wait: 5.minutes).perform_later(args[0])
    elsif active_appointments.size == 1
      active_appointments.each do |appointment|
        appointment.proposal.update(blocked: false)
        appointment.update(archived: false, appointment_status: "rescheduled")
      end
    end
    # Job will complete without rescheduling if there is 1 appointment or less coming up.
  end
end
