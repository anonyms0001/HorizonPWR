class CanvassController < ApplicationController
  require "madison"
  before_action :verify_authenticity_token, only: [:add_to_canvass, :deactivate_canvass]
  before_action :authenticate_user!, only: [:add_to_canvass, :deactivate_canvass]
  before_action :set_user, only: [:add_to_canvass, :deactivate_canvass, :reactivate_canvass]
  before_action :set_webhook_response, only: [:appointment, :interaction, :note]

  def note
    queue_note(verified_event)
    head :ok
  end

  def appointment
    queue_appointment(verified_event)
    head :ok
  end

  def interaction
    queue_interaction(verified_event)
    head :ok
  end

  def add_to_canvass
    # TODO: Or find the user in canvass if they already exist
    # @user = User.find(params[:user_id])
    response = CanvassClient.new.employee_add(@user)
    if response["employee_id"].to_i > 0 && @user.update(canvass_user_id: response["employee_id"]) && @user.update(canvass_user_active: true)
      # flash[:notice] = "A Canvass account has been created for this user."
      redirect_back(fallback_location: edit_user_path(@user), notice: "A Canvass account has been created for this user.")
    else
      # flash[:alert] = "The Canvass account could not be created."
      redirect_back(fallback_location: edit_user_path(@user), notice: "A Canvass account can't be created for this user.")
    end
  end

  def deactivate_canvass
    response = CanvassClient.new.employee_deactivate(@user)
    if response["employee_id"] > 0 && @user.update(canvass_user_active: false)
      # flash[:notice] = "A Canvass account has been deactivated for this user."
      redirect_back(fallback_location: edit_user_path(@user), notice: "A Canvass account has been deactivated for this user.")
    else
      # flash[:alert] = "The Canvass account could not be deactivated."
      redirect_back(fallback_location: edit_user_path(@user), alert: "The Canvass account could not be deactivated.")
    end
  end

  def reactivate_canvass
    response = CanvassClient.new.employee_reactivate(@user)
    if response["employee_id"] > 0 && @user.update(canvass_user_active: true)
      # flash[:notice] = "A Canvass account has been reactivated for this user."
      redirect_back(fallback_location: edit_user_path(@user), notice: "A Canvass account has been reactivated for this user.")
    else
      # flash[:alert] = "The Canvass account  could not be reactivated."
      redirect_back(fallback_location: edit_user_path(@user), alert: "The Canvass account  could not be reactivated.")
    end
  end

  private

  def set_webhook_response
    @resp = request.request_parameters
  end

  # def site_audit_interaction(user, appointment)
  #   if appointment.proposals.last.completion_state == "complete"
  #     appointment.proposals.last.update(completion_state: "ready for close call")
  #     # update the scheduled_with to be the user that pushed the site audit pin
  #     appointment.update(scheduled_with: user)
  #   else
  #     Honeybadger.notify("Proposal not ready for Site Audit Pin to be pushed")
  #   end
  # end

  def set_user
    @user = User.find(params[:user_id])
  end

  def verified_event
    event_type = "Canvass-#{@resp["type"]&.capitalize}"
    record = IncomingWebhook.create(payload: @resp, event_type: event_type)
    {IncomingWebhook: record.id}
  end
  # NOTE: how to test canvass webhooks
  # @resp = json
  # event = results of CanvassController.verified_event
  # CanvassAppointmentJob.perform_later(event)

  def queue_appointment(event)
    CanvassAppointmentJob.perform_later(event)
  end

  def queue_interaction(event)
    CanvassInteractionJob.perform_later(event)
  end

  def queue_note(event)
    CanvassNoteJob.perform_later(event)
  end

  # DuplicateProposalsJob.set(wait: 5.minutes).perform_later(proposal_id_array)

  # def handle_duplicate_proposals(proposal_id_array)
  #   # Necessary because ActiveJob can't handle ActiveRecord::Associations::CollectionProxy
  #   proposals = Proposal.where(id: proposal_id_array)
  #
  #   proposals.update_all(blocked: true, blocked_on: "Duplicate Proposal", reason_incomplete: "More than one appointment created in canvass")
  #
  #   # Notify the Sales Rep
  #   # send_dup_proposal_notification(proposals)
  #
  #   # DuplicateProposalsJob.set(wait: 5.minutes).perform_later(proposal_id_array)
  #
  #   # Notify the manager if it hasn't been fixed after 30 minutes
  #   # This might need to be a separate story since many Reps don't have managers in the system (ie they aren't assigned to a Team)
  #   # DuplicateProposalsMgrJob.set(wait: 30.minutes).perform_later(proposal_id_array)
  # end

  def send_dup_proposal_notification(proposals)
    notification = IncomingWebhookNotification.with(proposals: proposals)
    notification.deliver_later(proposals.first.appointment.created_by)
  end

  def find_contact_by_canvass_id(id)
    Contact.find_by(canvass_contact_id: id)
  end

  def find_contact(canvass_contact)
    first_name = canvass_contact["first_name"]
    last_name = canvass_contact["last_name"]
    phone = Phonelib.parse(canvass_contact["phone_mobile"]).full_e164.presence
    Contact.find_by(first_name: first_name, last_name: last_name, phone: phone)
  end

  def create_contact(canvass_contact, user, account)
    Contact.create(
      first_name: canvass_contact["first_name"],
      last_name: canvass_contact["last_name"],
      email: canvass_contact["email_personal"],
      phone: canvass_contact["phone_mobile"],
      birth_date: canvass_contact["birthdate"],
      gender: canvass_contact["gender"] == "M",
      # user_id: user,
      account_id: account&.id,
      user_id: user&.id,
      created_at: canvass_contact["created"],
      updated_at: canvass_contact["modified"],
      salesforce_lead_id: nil,
      salesforce_opportunity_id: nil,
      canvass_contact_id: canvass_contact["id"],
      lead_source: "canvass"
    )
  end

  def find_address_by_canvass_id(id)
    Address.find_by(canvass_address_id: id)
  end

  def find_address_by_address(canvass_address)
    street = canvass_address["street"]
    city = canvass_address["city"]
    state = canvass_address["region"]
    postal_code = canvass_address["postal"]
    number = canvass_address["number"]
    Address.find_by(number: number, street: street, city: city, state: state, postal_code: postal_code)
  end

  def create_address(canvass_address)
    create_canvass_address_vars(canvass_address)

    Address.create(
      latitude: @latitude,
      longitude: @longitude,
      address_type: @address_type,
      canvass_address_id: @canvass_address_id,
      number: @number,
      street: @street,
      city: @city,
      state: @state,
      postal_code: @postal_code,
      address: "#{@number} #{@street} #{@city}, #{@state} #{@postal_code}"
    )
  end

  def create_canvass_address_vars(canvass_address)
    @latitude = canvass_address["lat"]
    @longitude = canvass_address["lng"]
    @address_type = "residential"
    @canvass_address_id = canvass_address["id"]
    @number = canvass_address["number"]
    @street = format_address_var("street", canvass_address["street"])
    @city = format_address_var("city", canvass_address["city"])
    @state = format_address_var("state", canvass_address["region"])
    @postal_code = canvass_address["postal"]
  end

  def format_address_var(type, var)
    case type
    when "street"
      var.titleize
    when "city"
      var.capitalize
    when "state"
      if var.length > 2
        abbr = Madison.get_abbrev var
        var = abbr unless abbr.nil?
      end
      var.upcase
    end
  end

  def create_contact_address(contact, address, primary_contact = false)
    ContactAddress.create(contact: contact, address: address, primary_contact: primary_contact)
  end

  # Appointment.new()
  # Contact.new()
  # Address.new()
  #
  # URL: http://1da02c5a49c3.ngrok.io/canvass/note
  # {"action":"create","type":"note","data":
  #   {"note":
  #      {"id":16885,"address_id":141180091,"customer_id":null,"employee_id":208,"content":"Noncommital gesture ","offline_uuid":"8157BBBF-FD56-4913-B234-27F1A011A731","created":"2021-01-25T19:56:25.000Z","modified":"2021-01-25T19:56:25.000Z"},
  #    "address":
  #      {"id":141180091,"lat":"43.82876266","lng":"-111.77203588","number":"122","street":"N Fourth E #2","unit":null,"city":"Rexburg","district":null,"region":"ID","postal":"83440","country":null},
  #    "address_fields":
  #      {},
  #    "customer":null,"custom_fields":
  #      {},
  #    "employee":null}}
  #
  # Completed 200 OK in 2ms (Views: 0.1ms | ActiveRecord: 0.0ms | Allocations: 701)
  #
  #
  # URL: http://pwrstation.horizonpwr.com/api/canvassInteraction
  # {"action":"create","type":"interaction","data":
  #   {"interaction":
  #      {"id":443913,"address_id":69733521,"customer_id":null,"employee_id":185,"type_id":25,"sub_type_id":25,"offline_uuid":"511AC24F-6E49-4971-8F32-172E6448367C","created":"2021-01-25T19:07:47.000Z","modified":"2021-01-25T19:07:47.000Z","type_name":"Competitor","sub_type_name":"Competitor"},
  #    "address":
  #      {"id":69733521,"lat":"44.02968660","lng":"-121.32580560","number":"61383","street":"ROCK BLUFF LN","unit":"","city":"BEND","district":"","region":"OR","postal":"97702","country":"US"},
  #    "address_fields":
  #      {},
  #    "customer":null,"custom_fields":
  #      {},
  #    "employee":
  #      {"id":185,"first_name":"Dennis","alias":"","last_name":"Miller","email":"dennis.miller@horizonpwr.com","group_id":7,"created":"2020-12-16T18:58:50.000Z","modified":"2020-12-16T18:59:00.000Z","group_name":"Bend"}}
  # }
  #
  # URL: http://pwrstation.horizonpwr.com/api/canvassAppointment
  # {"action":"create","type":"appointment","data":
  #   {"appointment":
  #      {"id":18012,"address_id":127926925,"customer_id":32611,"employee_id":67,"uuid":"8fa96c50-5f36-11eb-b514-23d02f724633","title":"John Lee","location":"1655 W Santa Clara Dr  Meridian ID 83642","start":"2021-01-27T00:00:43.000Z","end":"2021-01-27T00:00:43.000Z",
  #       "notes":"","held":false,"held_by":null,"offline_uuid":"73069B60-90A7-48DA-AC67-F44D41C6D921","created":"2021-01-25T17:55:50.000Z","modified":"2021-01-25T17:55:50.000Z"},
  #    "address":
  #      {"id":127926925,"lat":"43.61576000","lng":"-116.41411900","number":"1655","street":"W Santa Clara Dr","unit":"","city":"Meridian","district":"Ada","region":"ID","postal":"83642","country":"US"},
  #    "address_fields":
  #      {},
  #    "customer":
  #      {"id":32611,"first_name":"John","last_name":"Lee","gender":null,"birthdate":null,"email_personal":"","phone_mobile":"+1 (208) 859-4020","created":"2021-01-25T17:45:43.000Z","modified":"2021-01-25T17:45:43.000Z"},
  #    "custom_fields":
  #      {},
  #    "appointment_assignments":[
  #     {"id":67,"first_name":"Jeremy","alias":"","last_name":"Hall","email":"jeremy.hall@horizonpwr.com","group_id":3,"created":"2020-05-21T16:17:08.000Z","modified":"2021-01-21T17:49:42.000Z","group_name":"Boise","permission":"owner"}],
  #    "employee":
  #      {"id":67,"first_name":"Jeremy","alias":"","last_name":"Hall","email":"jeremy.hall@horizonpwr.com","group_id":3,"created":"2020-05-21T16:17:08.000Z","modified":"2021-01-21T17:49:42.000Z","group_name":"Boise"}}
  # }
end
