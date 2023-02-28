class CanvassInteractionJob < ApplicationJob
  queue_as :default

  def perform(*args)
    Honeybadger.context({args: args})
    # Do something later
    webhook = IncomingWebhook.find(args.first[:IncomingWebhook])
    payload = webhook.payload

    data = payload["canvass"]["data"]
    canvass_employee = data["employee"]
    # created_by = CanvassClient.find_or_link_user(canvass_employee)

    type_name = payload["data"]["interaction"]["type_name"]

    case type_name
    when "Not Home"
    when "Go Back"
    when "Not Ready Yet (Keep Knocking)"
    when "Appointment Scheduled"
    when "No Show (Needs Rescheduled)"
    when "Rescheduled"
    when "Commercial Lead"
    when "Appointment Canceled"
    when "Renter"
    when "Competitor"
    when "Failed Credit"
    when "Sit Not Sold"
      # Creates an earning for an FM, but not for an EC
      # CreateEarningJob.perform_later(args[0])
      # employee = User.find_by(canvass_user_id: payload["data"]["interaction"]["employee_id"])
      # address = Address.find_or_create_by_canvass(payload["data"]["address"])
      # Earning.create_quality_sit!(employee, address, nil)
    when "Site Audit"
      # Mark Proposal as Ready For Close
      # CanvassInteractionJob.perform_later(args[0])
    when "Install"
    when "Project Complete"
    end
  end
end
