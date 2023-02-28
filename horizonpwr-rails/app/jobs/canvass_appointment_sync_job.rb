class CanvassAppointmentSyncJob < ApplicationJob
  queue_as :low

  def perform(*args)
    Honeybadger.context({args: args})
    begin
      canvass_appointment = args.first

      address = Address.find_or_initialize_by(canvass_address_id: canvass_appointment["address_id"])
      contact = address.contacts.find_or_initialize_by(canvass_contact_id: canvass_appointment["customer_id"])
      appointment = address.appointments.find_or_initialize_by(canvass_appointment_id: canvass_appointment["id"])

      created_by = User.find_by(canvass_user_id: canvass_appointment["employee_id"])
      held_by = User.find_by(canvass_user_id: canvass_appointment["held_by"])
      account = CanvassClient.find_account_from_group_id(canvass_appointment["group_id"])

      ActiveRecord::Base.transaction do
        if !address.persisted?
          address.address = canvass_appointment["location"]
          address.address_type = "residential"
        end

        contact.name = canvass_appointment["title"] unless contact.persisted?

        appointment.appointment_type = "consult"
        appointment.source = "canvass"
        appointment.created_by_id = created_by&.id
        appointment.account_id = account&.id
        appointment.address_id = address.id
        appointment.start_at = canvass_appointment["start"]
        appointment.held_by_id ||= held_by
        appointment.held_at ||= canvass_appointment["marked_held_date"]
        appointment.held ||= canvass_appointment["held"]

        address.save!
        contact.save!
        appointment.save!
        Proposal.find_or_create_by!(address: address, appointment: appointment)
      end
      # TODO: StandardRB says "Lint/RescueException: Avoid rescuing the `Exception` class. Perhaps you meant to rescue `StandardError`?"
    rescue Exception => e
      Honeybadger.notify(e)
    end
  end
end
