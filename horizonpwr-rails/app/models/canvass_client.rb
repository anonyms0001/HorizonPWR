class CanvassClient
  attr_reader :public_url, :company_token, :division_id

  def initialize
    require "uri"
    require "net/http"

    @public_url = Rails.application.credentials.canvass[:public_url]
    @company_token = Rails.application.credentials.canvass[:company_token]
    @division_id = Rails.application.credentials.canvass[:division_id]
  end

  def find_address_match(address)
    require "json"

    url = URI("#{public_url}/company/addresses/match")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Post.new(url)
    request["Authorization"] = "Bearer #{company_token}"
    request["Content-Type"] = "application/json"

    request.body = JSON.dump(
      {
        number: "3509",
        street: "S manzan",
        city: "St. George",
        region: "UT",
        postal: "84790",
        lat: 37.0486623,
        lng: -113.6063216
      }
    )

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_info(canvass_employee_id)
    url = URI("#{public_url}/company/employees/#{canvass_employee_id}")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_add(user, admin = "false", active = "true")
    url = URI("#{public_url}/company/employees")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Post.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    form_data = [
      ["email", user.email.to_s],
      ["password", SecureRandom.hex(8).to_s],
      ["first_name", user.first_name],
      ["last_name", user.last_name],
      ["mobile_phone", user.phone],
      ["admin", admin],
      ["active", active],
      ["external_id", user.id.to_s],
      ["division_id", division_id]
    ]
    request.set_form form_data, "multipart/form-data"
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_deactivate(user, active = "false")
    url = URI("#{public_url}/company/employees/#{user.canvass_user_id}")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Put.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    form_data = [
      ["active", active],
      ["division_id", division_id]
    ]
    request.set_form form_data, "multipart/form-data"
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_reactivate(user, active = "true")
    url = URI("#{public_url}/company/employees/#{user.canvass_user_id}")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Put.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    form_data = [
      ["active", active],
      ["division_id", division_id]
    ]
    request.set_form form_data, "multipart/form-data"
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_edit(user, admin = "false", active = "true")
    url = URI("#{public_url}/company/employees/#{user.canvass_user_id}")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Put.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    form_data = [
      ["email", user.email.to_s],
      ["first_name", user.first_name],
      ["last_name", user.last_name],
      ["mobile_phone", user.phone],
      ["active", active],
      ["external_id", user.id.to_s],
      ["division_id", division_id]
    ]
    request.set_form form_data, "multipart/form-data"
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_groups_get(employee_id)
    url = URI("#{public_url}/company/employees/#{employee_id}/groups")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_groups_edit(employee_id)
    url = URI("#{public_url}/company/employees/#{employee_id}/groups")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Put.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    # account_ids = User.find_by(canvass_user_id: employee_id).accounts.impersonal.map(&:canvass_team_id)
    # print account_ids
    form_data = [
      ["group_id", "3"]
    ]

    request.set_form form_data, "multipart/form-data"
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_settings_get(employee_id)
    url = URI("#{public_url}/company/employees/#{employee_id}/integrationSettings")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_settings_edit(employee_id)
    url = URI("#{public_url}/company/employees/#{employee_id}/integrationSettings")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Put.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_settings_delete(employee_id)
    url = URI("#{public_url}/company/employees/#{employee_id}/integrationSettings/")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Delete.new(url)
    request["Authorization"] = "Bearer #{company_token}"
    request["Content-Type"] = "application/x-www-form-urlencoded"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def employee_appointments_get(employee_id)
    url = URI("#{public_url}/company/appointments/employees/#{employee_id}?division_id=1")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def groups_get
    url = URI("#{public_url}/company/groups")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def sync_teams
    teams = groups_get
    teams.each do |team|
      account = Account.find_or_create_by(name: team["name"], personal: false, owner_id: 1)
      if !account.historic_canvass_team_ids.include?(team["group_id"].to_s)
        account.historic_canvass_team_ids.push(team["group_id"])
      end
      account.update(canvass_team_id: team["group_id"]) if account.present? && account.canvass_team_id.nil?
    end
  end

  def groups_add
    url = URI("#{public_url}/company/groups")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Post.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def integrations_get
    url = URI("#{public_url}/company/integrations")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def interactions_delete
    url = URI("#{public_url}/company/interactions/type/19/address")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Delete.new(url)
    request["Authorization"] = "Bearer #{company_token}"
    request["Content-Type"] = "application/x-www-form-urlencoded"
    request.body = "custom_field_key=Custom%20Field%20Example%20Label&custom_field_values=test%20information"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def find_appointment(id)
    url = URI("#{public_url}/company/appointments/#{id}?division_id=1")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def interaction_types_get
    url = URI("#{public_url}/company/interaction_types")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def note_create(note)
    url = URI("#{public_url}/company/notes")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Post.new(url)
    request["Authorization"] = "Bearer #{company_token}"
    form_data = [
      ["address_id", note.address.canvass_address_id.to_s],
      ["employee_id", note.user.canvass_user_id.to_s],
      ["content", note.body]
    ]
    request.set_form form_data, "multipart/form-data"
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def note_edit(note)
    url = URI("#{public_url}/company/notes/742")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Put.new(url)
    request["Authorization"] = "Bearer #{company_token}"
    form_data = [
      ["address_id", note.address.canvass_address_id.to_s],
      ["customer_id", note.address.primary_contact.canvass_contact_id.to_s],
      ["content", note.body],
      ["employee_id", note.user.canvass_user_id.to_s]
    ]
    request.set_form form_data, "multipart/form-data"
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def company_leads_post(contact, campaign = "PWRStation")
    url = URI("#{public_url}/company/leads")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Post.new(url)
    request.body = "lead_campaign=#{campaign}&lead_first_name=#{contact.first_name}&lead_last_name=#{contact.last_name}&lead_email_personal=#{contact.email}&lead_email_work=#{contact.email}&lead_phone_mobile=#{contact.phone}&lead_phone_home=#{contact.phone1}&lead_phone_work=&lead_gender=#{contact.gender}&lead_birthdate=#{contact.birth_date}&lead_assignments_by_email=#{contact.created_by}&lead_assignments_by_email_permissions=#{contact.first_name}&lead_status=#{contact.first_name}&group_id=#{account.canvass_id}&address_number_street=#{contact.address.street}&address_number=#{contact.address.number}&address_street=#{contact.address.street}&address_city=#{contact.address.city}&address_state=#{contact.address.state}&address_postal=#{contact.address.postal}&manual_test=true"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def company_divisions
    url = URI("#{public_url}/company/divisions")

    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{company_token}"

    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def get_users(num)
    missing_rep_count = 0
    rep_count = 0
    while rep_count < num
      json = employee_info(rep_count)
      if json["message"] == "No rep found"
        missing_rep_count += 1
        print "-"
      else
        rep_count += 1
        print "."
        link_canvass_id_to_user(json["email"], json["employee_id"])
      end
    end
    puts "#{rep_count} canvass users"
    puts "#{missing_rep_count} reps were not found"
  end

  def self.find_or_create_address(canvass_address)
    street = canvass_address["street"]
    city = canvass_address["city"]
    state = canvass_address["region"]
    postal_code = canvass_address["postal"]
    number = canvass_address["number"]

    latitude = canvass_address["lat"]
    longitude = canvass_address["lng"]
    canvass_id = canvass_address["id"]

    address = Address.find_by(canvass_address_id: canvass_id) ||
      Address.find_by(number: number, street: street, city: city, state: state, postal_code: postal_code) ||
      Address.create(number: number,
        street: street,
        city: city,
        state: state,
        postal_code: postal_code,
        latitude: latitude,
        longitude: longitude,
        canvass_address_id: canvass_id,
        address_type: "residential",
        address: "#{number} #{street} #{city}, #{state} #{postal_code}")

    address.update(canvass_address_id: canvass_id) if address.canvass_address_id.blank?
    address
  end

  def self.find_or_link_user(canvass_employee)
    return nil if canvass_employee.nil?
    user = User.find_by(canvass_user_id: canvass_employee["id"]) ||
      User.find_by(email: canvass_employee["email"].downcase)
    canvass_error("could not find or link user", canvass_employee) unless user.present?
    # TODO: Notify HR if user is not present
    user
  end

  def self.find_or_link_account(canvass_employee)
    return nil if canvass_employee.nil?
    Account.find_by(canvass_team_id: canvass_employee["group_id"]) ||
      Account.find_by(name: canvass_employee["group_name"]) ||
      canvass_error("could not find or link account", canvass_employee)
  end

  def self.find_or_create_appointment(canvass_appointment, address, created_by, account)
    appointment = Appointment.find_by(canvass_appointment_id: canvass_appointment["id"])
    if appointment.nil?
      ActiveRecord::Base.transaction do
        appointment = create_appointment(canvass_appointment, address, created_by, account)
        Proposal.create!(address: address, appointment: appointment)
      end

      # proposal_id_array = appointment.proposal.id
      # if proposal_id_array.count > 1
      if appointment.proposal.present?
        # IncomingWebhook.create(payload: @resp, event_type: "find_or_create_appointment")
        # handle_duplicate_proposals(proposal_id_array)
      end
    else
      Honeybadger.notify("Canvass webhook attempting to change the account_id for an appointment") if appointment.account != account
      if created_by.sales?
        appointment.update(start_at: canvass_appointment["start"].to_datetime)
      else
        appointment.update(start_at: canvass_appointment["start"].to_datetime, account: account)
      end
      held_by = User.find_by(canvass_user_id: canvass_appointment["held_by"])
      AccountUser.find_or_create_by(user: held_by, account: account) if held_by.present?
    end
    appointment
  end

  def self.find_account_from_group_id(id)
    # Canvass doesn't allow us to un-archive groups resulting in new groups being created for existing groups
    # resolution, we can add historic ids here so that we can map them to
    Account.find_by(canvass_team_id: id) ||
      Account.where("? = ANY (historic_canvass_team_ids)", id).first
  end

  def self.create_appointment(canvass_appointment, address, created_by, account)
    Honeybadger.context(
      canvass_appointment: canvass_appointment,
      address: address,
      created_by: created_by,
      account: account
    )

    held_by = User.find_by(canvass_user_id: canvass_appointment["held_by"])
    AccountUser.find_or_create_by(user: held_by, account: account) if held_by.present?
    scheduled_with = if account.present? && created_by.present?
      AccountUser.find_or_create_by(
        account: account,
        user: created_by
      )&.default_energy_consultant&.id
    end
    appointment_status = canvass_appointment["number_reschedules"] == 0 ? "scheduled" : "rescheduled"
    start_at = canvass_appointment["start"].to_datetime

    address.appointments.create!(
      start_at: start_at,
      end_at: (start_at + 1.hour),
      appointment_status: appointment_status,
      appointment_status_reason: nil,
      appointment_type: "consult",
      source: "canvass",
      created_by: created_by,
      scheduled_with_id: scheduled_with,
      account: account,
      project_id: nil,
      created_by_position_id: created_by&.job_position&.id,
      salesforce_opportunity_id: nil,
      salesforce_residential_project_id: nil,
      canvass_appointment_id: canvass_appointment["id"],
      held: canvass_appointment["held"],
      held_by: User.find_by(canvass_user_id: canvass_appointment["held_by"]),
      held_at: canvass_appointment["held_at"]
    )
    # TODO: We no longer create an association for contacts to an appointment because of a change we made with address.
    # We will need to make sure to add contactappointments later
  end

  def self.find_or_create_contact(canvass_customer, address, created_by, account)
    canvass_id = canvass_customer["id"]
    first_name = canvass_customer["first_name"]
    last_name = canvass_customer["last_name"]
    email = canvass_customer["email_personal"]
    birth_date = canvass_customer["birthdate"]&.to_date
    gender = canvass_customer["gender"] == "M"

    contact = Contact.find_by(canvass_contact_id: canvass_id) ||
      Contact.find_by(first_name: first_name, last_name: last_name, birth_date: birth_date, gender: gender) ||
      address.contacts.create(
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: canvass_customer["phone_mobile"],
        user: created_by,
        account: account,
        salesforce_lead_id: nil,
        salesforce_opportunity_id: nil,
        lead_source: "canvass",
        phone1: nil,
        canvass_contact_id: canvass_id,
        birth_date: birth_date,
        gender: gender
      )

    contact.update(canvass_address_id: canvass_id) if contact.canvass_contact_id.blank?
    contact
  end

  def self.canvass_error(message, json)
    Honeybadger.context({json: json})
    if message == "could not find or link user"
      # TODO: Find or create a new Sales Hire applicant, and resend Sales Applicant Onboarding sign up email every time this is triggered.
      # This way if someone hasn't completed the onboarding flow on the new pwrstation, they will get a bunch of emails until they finally do.
      # This should help resolve this HB error https://app.honeybadger.io/projects/80575/faults/81859062/01FJZ450P827FE22HGX5FR8FYJ?page=0
      applicant = Applicant.find_or_initialize_by(
        new_email: json["email"].downcase
        # Intentionally not a lot here
      )
      applicant.first_name = json["first_name"]
      applicant.last_name = json["last_name"]
      applicant.account = find_account_from_group_id(json["group_id"])
      applicant.canvass_user_id = json["id"]
      unless applicant.persisted?
        applicant.status = "invited"
        applicant.job_position_id = 1
        applicant.start_date = Date.today.beginning_of_week + 1.day
      end
      applicant.save!(validate: false)
      applicant.notes.create(body: "Applicant created by system because canvass appointment was created by this user", user_id: 349)
      CanvassNonregisteredUserMailer.with(applicant: applicant).invite.deliver_later
      AppointmentCreatedByNonregisteredUserJob.perform_later(json)
    end
    Honeybadger.notify("Canvass Error: #{message}")
  end

  def update_appointments_created_by(user)
    canvass_appointments = employee_appointments_get(user.canvass_user_id) if user.canvass_user_id.present?
    if canvass_appointments.is_a?(Array) && canvass_appointments.any?
      extract_id = ->(h) { h["id"] }
      ids = canvass_appointments.map(&extract_id)
      Appointment.where(canvass_appointment_id: ids).update_all(created_by_id: user.id, created_by_position_id: user.job_position_id)
    end
  end

  # Job to update created by if the user is not signed up when the appointment gets created
  # - The canvass_error above creates an Applicant, but they still need a User
  # - Perhaps this job could watch for the created_by and create or update the Earning at that time
  # Can we assume the created_by is an FM? What about managers in training?
  # When the canvass_error creates an Applicant, who gets notified? Should we notify Matt/HR, so he can make sure they get onboarded??

  # We need the appointment and the user that created the appointment when we create the AppointmentCreatedByNonregisteredUserJob
  private

  def link_canvass_id_to_user(email, canvass_id)
    user = User.find_by(email: email)
    user.update(canvass_user_id: canvass_id) if user.present?
  end
end
