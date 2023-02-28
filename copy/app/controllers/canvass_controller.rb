class CanvassController < ApplicationController
  require "madison"
  skip_before_action :verify_authenticity_token
  before_action :set_canvass_response, only: :interaction

  def note
    # resp = request.raw_post
    # address =
    # contact =
    # created_by =

    head :ok
  end

  def appointment
    resp = request.request_parameters

    user = (
        User.find_by(canvass_user_id: resp["canvass"]["data"]["employee"]["id"]) ||
        User.find_by(email: resp["canvass"]["data"]["employee"]["email"])
      )
    if user.present? && !user.canvass_user_id.present?
      user.update(canvass_user_id: resp["canvass"]["data"]["employee"]["id"])
    end

    account = (
      Account.find_by(canvass_team_id: resp["canvass"]["data"]["employee"]["group_id"]) ||
      Account.find_by(name: resp["canvass"]["data"]["employee"]["group_name"]) ||
      nil
    )
    if account.present? && !account.canvass_team_id.present?
      account.update(canvass_team_id: resp["canvass"]["data"]["employee"]["group_id"])
    end

    account_user = AccountUser.find_or_create_by(account_id: account&.id, user_id: user&.id)

    unless user.present? && account.present?
      # TODO: Trigger email to be sent.
      # We should always have an Account, User and AccountUser.
      # If we are missing any of those, then something is out of sync between canvass and PWRStation.
    end

    canvass_address = resp["canvass"]["data"]["address"]
    address = (
      find_address_by_canvass_id(canvass_address["id"]) ||
      find_address_by_address(canvass_address) ||
      create_address(canvass_address)
    )
    if address.present? && !address.canvass_address_id.present?
      address.update(canvass_address_id: canvass_address["id"])
      # elsif address.present? && address.canvass_address_id.present?
      #   # TODO: We should update anything that doesn't match what we already have.
      #   #       The create_address(canvass_address) method now applies formatting, which we would want to save.
      #   address.update(
      #     canvass_address_id: canvass_address["id"] unless canvass_address_id == canvass_address["id"]
      #   )
    end

    canvass_contact = resp["canvass"]["data"]["customer"]
    contact = if canvass_contact.present?
      (
        find_contact_by_canvass_id(canvass_contact["id"]) ||
        find_contact(canvass_contact) ||
        create_contact(canvass_contact, user, account)
      )
      # else
      #   nil
      # Notify user that they saved an appointment without the contact. Please update the appointment to include the contact
    end
    # if contact.present? && address.present?
    #   ContactAddress.find_by(contact: contact, address: address) ||
    #     if address.contacts.any?
    #       create_contact_address(contact, address)
    #     else
    #       create_contact_address(contact, address, primary_contact: true)
    #     end
    # end

    case resp["canvass"]["action"]
    when "create"
      appointment = create_appointment(resp["canvass"]["data"]["appointment"], address, contact, user, account_user, account)
      appointment.address.proposals.create(address: address, appointment: appointment)
      @appointment = Appointment.find_by(canvass_appointment_id: resp["canvass"]["data"]["appointment"]["id"])
      if @appointment
        contact_name = if contact.present? && contact.first_name.present? && contact.last_name.present?
          "#{contact.first_name} #{contact.last_name}"
        else
          "Someone"
        end
        CreatedAppointment.with(appt: @appointment, customer: contact_name).deliver_later(@appointment.scheduled_with)
      end
    when "edit"
      appointment = Appointment.find_by(canvass_appointment_id: resp["canvass"]["data"]["appointment"]["id"])
      if appointment.present?
        appointment.update(
          date: resp["canvass"]["data"]["appointment"]["start"],
          appointment_status: "rescheduled"
        )
      else
        @appointment = create_appointment(resp["canvass"]["data"]["appointment"], address, contact, user, account_user, account)
      end
    end
    unless @appointment.present? && @appointment.persisted?
      Honeybadger.notify("Canvass Appointment create failed")
    end

    head :ok
  end

  def interaction
    user =
      User.find_by(email: @resp["canvass"]["data"]["employee"]["email"])

    if user.present? && !user.canvass_user_id.present?
      user.update(canvass_user_id: @resp["canvass"]["data"]["employee"]["id"])
    elsif !user
      Honeybadger.notify("Canvass site audit interaction user #{@resp["canvass"]["data"]["employee"]} can't be found ")
    end

    if @resp["canvass"]["data"]["customer"]
      canvass_contact = @resp["canvass"]["data"]["customer"]
      contact = if canvass_contact.present?
        (
          find_contact_by_canvass_id(canvass_contact["id"]) || find_contact(canvass_contact)
        )
      else
        Honeybadger.notify("Canvass Contact #{canvass_contact["id"]} #{canvass_contact["first_name"]} #{canvass_contact["last_name"]} can't be found - Canvass Controller Interaction")
      end
    end

    canvass_address = @resp["canvass"]["data"]["address"]
    if user.present? && !user.canvass_user_id.present?
      user.update(canvass_user_id: resp["canvass"]["data"]["employee"]["id"])
    end

    address = if canvass_address.present?
      (
        find_address_by_canvass_id(canvass_address["id"]) || find_address_by_address(canvass_address)
      )
    else
      Honeybadger.notify("Canvass Address #{canvass_address["id"]} - #{address} can't be found - Canvass Controller Interaction")
    end

    if @resp["canvass"]["data"]["interaction"]["type_name"] == "Site Audit"

      appointment = address.appointments.last
      # appointment_scheduled_with_id = user

      if !appointment.contacts.includes(contact)
        # We are making the assumption that a contact is already in the system on that particular appointment.
        # if we can't find that contact on the appointment that we are updating, then trigger a HoneyBadger error
        Honeybadger.notify("Appointment #{appointment.inspect} does not include the correct contact #{contact.inspect} for this appointment")
      end

      site_audit_interaction(user, appointment)
    else
      head :ok
    end
  end

  private

  def site_audit_interaction(user, appointment)
    if appointment.proposals.last.completion_state == "complete"
      appointment.proposals.last.update(completion_state: "ready for close")
      # update the scheduled_with to be the user that pushed the site audit pin
      appointment.update(scheduled_with: user)
    else
      Honeybadger.notify("Proposal not ready for Site Audit Pin to be pushed")
    end
  end

  def set_canvass_response
    @resp = request.request_parameters
  end

  def create_appointment(canvass_appointment, address, contact, user, account_user, account)
    address.appointments.create(
      date: canvass_appointment["start"],
      appointment_status: "scheduled",
      appointment_status_reason: nil,
      appointment_type: "consult",
      source: "Canvass",
      created_by_id: user&.id,
      scheduled_with_id: account_user&.default_energy_consultant&.id,
      account_id: account&.id,
      project_id: nil,
      created_by_position_id: user&.job_position,
      salesforce_opportunity_id: nil,
      salesforce_residential_project_id: nil,
      canvass_appointment_id: canvass_appointment["id"]
    )
    # TODO: We no longer create an association for contacts to an appointment because of a change we made with address. We will need to make sure to add contactappointments later
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
      lead_source: "Canvass"
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
    Address.where(number: number, street: street, city: city, state: state, postal_code: postal_code).first
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

  # def create_contact_address(contact, address, primary_contact = false)
  #   ContactAddress.create(contact: contact, address: address, primary_contact: primary_contact)
  # end

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
