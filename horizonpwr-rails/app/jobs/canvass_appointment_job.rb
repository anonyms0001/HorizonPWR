class CanvassAppointmentJob < ApplicationJob
  queue_as :default

  def perform(*args)
    Honeybadger.context({args: args})
    webhook = IncomingWebhook.find(args.first[:IncomingWebhook])
    payload = webhook.payload

    data = payload["canvass"]["data"]
    canvass_address = data["address"]
    canvass_appointment = data["appointment"]

    canvass_employee = data["employee"]
    canvass_customer = data["customer"]
    # canvass_scheduled_with_employee = data["appointment_assignments"][1]

    # begin
    # scheduled_with = find_or_link_user(canvass_scheduled_with_employee)
    # rescue Exception => error
    # end

    address = CanvassClient.find_or_create_address(canvass_address)
    created_by = CanvassClient.find_or_link_user(canvass_employee)
    account = CanvassClient.find_or_link_account(canvass_employee)
    CanvassClient.find_or_create_contact(canvass_customer, address, created_by, account)
    if CanvassClient.find_or_create_appointment(canvass_appointment, address, created_by, account)
      DuplicateProposalsJob.perform_later(args[0])
    end
  end
end
