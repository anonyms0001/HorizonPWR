class AuroraClient
  attr_reader :tenant_id, :bearer_token, :host_api, :host_url

  def initialize
    require "uri"
    require "net/http"
    require "openssl"

    @tenant_id = Rails.application.credentials.aurora[:tenant_id]
    @bearer_token = Rails.application.credentials.aurora[:bearer_token]
    @host_url = Rails.application.credentials.aurora[:host_url]
    @host_api = Rails.application.credentials.aurora[:host_api]
  end

  def retrieve_project(project_id)
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/projects/#{project_id.strip}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"

    response = http.request(request)
    # puts response.read_body
    json = JSON.parse(response.read_body)
    json["project"].nil? ? nil : json
  end

  def create_project(proposal, user)
    if proposal.aurora_project_id.nil?
      url = URI("https://#{@host_api}/v2/tenants/#{tenant_id}/projects")

      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true

      request = Net::HTTP::Post.new(url)
      request["Accept"] = "application/json"
      request["Content-Type"] = "application/json"
      request["Authorization"] = "Bearer #{bearer_token}"
      customer = proposal.contacts.first
      address = proposal.address

      request.body = {
        project:
          {
            customer_first_name: customer&.first_name,
            customer_last_name: customer&.last_name,
            customer_address: address.full_address,
            customer_email: customer&.email,
            customer_phone: customer&.phone,
            name: address.full_address,
            address: address.full_address,
            latitude: address.latitude,
            longitude: address.longitude,
            owner_id: user.aurora_user_id
          }
      }.to_json

      response = http.request(request)
      # puts response.read_body
      # json = JSON.parse(response.read_body)
      JSON.parse(response.read_body)

      # :project_type,
      # :owner_id,
      # :status # Residential by default
      # :external_provider_id, :name, :customer_salutation, :customer_first_name, :customer_last_name, :customer_address, :customer_email, :customer_phone, :address, :latitude, :longitude, :project_type, :owner_id, :status
    end
  end

  def list_users
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/users")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"

    response = http.request(request)
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)

    # puts response.read_body

    # Response body:
    # {
    #   "users": [
    #     {
    #       "id": "9837376a-9f4d-4431-96e1-7f6da022cf4e",
    #       "email": "george@test.com",
    #       "account_status": "pending",
    #       "first_name": "george",
    #       "last_name": "jungle"
    #     },
    #     {
    #       "id": "8bff4395-3a11-4ce3-b4f3-c15a6d0c5e0f",
    #       "email": "rod.klingler@horizonpwr.com",
    #       "account_status": "active",
    #       "first_name": "Rod",
    #       "last_name": "Klingler"
    #     },
    #     {
    #       "id": "b629897f-5952-42f3-9706-c53c96d3f1e4",
    #       "email": "mpangarita@aurorasolar.com",
    #       "account_status": "active",
    #       "first_name": "Maria Paula",
    #       "last_name": "Angarita"
    #     },
    #     {
    #       "id": "3cb90de6-6e6b-4df2-8481-ea5264435c3a",
    #       "email": "collin.swainston@horizonpwr.com",
    #       "account_status": "deactivated",
    #       "first_name": "Collin",
    #       "last_name": "Swainston"
    #     },
    #     {
    #       "id": "18fa0cb2-763d-49b7-a443-c5ab66eb35e2",
    #       "email": "kendrikc.rambal@horizonpwr.com",
    #       "account_status": "active",
    #       "first_name": "Kendrikc",
    #       "last_name": "Rambal"
    #     },
    #     {
    #       "id": "5cbf1961-613d-4abe-80c3-178b37ce558e",
    #       "email": "willard.moore@horizonpwr.com",
    #       "account_status": "active",
    #       "first_name": "Willard",
    #       "last_name": "Moore"
    #     },
    #     {
    #       "id": "30b27083-1f39-419b-84ca-b5c922bfc466",
    #       "email": "ben.sanchez@horizonpwr.com",
    #       "account_status": "active",
    #       "first_name": "Ben",
    #       "last_name": "Sanchez"
    #     }
    #   ]
    # }
  end

  def create_user
    # Only used for SSO (Single Sign-On)
  end

  def retrieve_user(user)
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/users/#{user.aurora_user_id}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer #{bearer_token}"
    request["Accept"] = "application/json"

    response = http.request(request)
    json = JSON.parse(response.read_body)
    json["user"].nil? ? nil : link_aurora_user(json["user"])
  end

  def link_aurora_user(json)
    user = User.find_by(email: json["email"])
    user.update(aurora_user_id: json["id"]) if user.present?
  end

  def invite_user(user, user_level = "Team Member")
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/users/invite")
    # https://docs.aurorasolar.com/reference/inviteuser

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    request.body = {
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        title: user.job_position&.name,
        user_level: user_level
      }
    }.to_json
    response = http.request(request)
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)

    # {
    #   "user": {
    #     "id": "fdbcac2a-976e-4a37-acc4-0c27b7193b2b",
    #     "email": "somedude@test.com",
    #     "account_status": "pending",
    #     "phone": null,
    #     "first_name": "Some",
    #     "last_name": "Dude",
    #     "title": null,
    #     "tenant_id": "2869d947-2140-4f4d-817d-da6440c74c31",
    #     "external_provider_id": null,
    #     "user_level": "Team Member"
    #   }
    # }
    #
    # {
    #   "error": {
    #     "email": [
    #       "can't be blank",
    #       "is invalid"
    #     ],
    #     "username": [
    #       "can't be blank",
    #       "has already been taken"
    #     ]
    #   }
    # }
  end

  def activate_user(user)
    user_id = user.aurora_user_id # "18fa0cb2-763d-49b7-a443-c5ab66eb35e2"
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/users/#{user_id}/activate")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Put.new(url)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"

    # response = http.request(request)
    http.request(request)

    # Returns 204 No Content
    # #<Net::HTTPNoContent 204 No Content readbody=true>
    # Anything else is a failure.
  end

  def deactivate_user(user)
    user_id = user.aurora_user_id # "18fa0cb2-763d-49b7-a443-c5ab66eb35e2"
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/users/#{user_id}/deactivate")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Put.new(url)
    request["Authorization"] = "Bearer #{bearer_token}"

    # response = http.request(request)
    http.request(request)

    # Returns 204 No Content
    # #<Net::HTTPNoContent 204 No Content readbody=true>
    # Anything else is a failure.
  end

  def update_user(user, user_level = "Team Member")
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/users/#{user.aurora_user_id}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Put.new(url)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    request.body = {
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        title: user.job_position&.name,
        user_level: user_level
      }
    }.to_json

    response = http.request(request)
    puts response.read_body
  end

  def list_projects
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/projects")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    response = http.request(request)
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def retrieve_consumption(project_id)
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/projects/#{project_id}/consumption_profile")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"

    response = http.request(request)
    json = JSON.parse(response.read_body)

    # monthly_consumption = json["consumption_profile"] ? json["consumption_profile"]["monthly_energy"] : nil
    json["consumption_profile"] ? json["consumption_profile"]["monthly_energy"] : nil
  end

  def retrieve_tenant
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"

    response = http.request(request)
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def update_consumption(proposal, monthly_usage)
    project_id = proposal.aurora_project_id
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/projects/#{project_id}/consumption_profile")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Put.new(url)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    request.body = {consumption_profile: {
      monthly_energy: monthly_usage
    }}.to_json

    response = http.request(request)
    # puts response.read_body
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def assign_project_owner_id(aurora_project_id, user)
    update_project(aurora_project_id, user)
  end

  def update_project(aurora_project_id, user)
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/projects/#{aurora_project_id}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Put.new(url)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    request.body = {project: {
      owner_id: user.aurora_user_id
    }}.to_json

    response = http.request(request)
    puts response.read_body
  end

  def request_3dms(proposal, user)
    assign_project_owner_id(proposal.aurora_project_id, user)
    if user.aurora_user_id.nil? && retrieve_user(user)
      halt(msg: "Must have an aurora user")
    end
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/designs")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    request.body = {design: {
      project_id: proposal.aurora_project_id,
      name: proposal.address.full_address,
      external_provider_id: proposal.id
    }}.to_json

    response = http.request(request)
    # puts response.read_body
    json = JSON.parse(response.read_body)
    proposal.update(
      completion_state: "pending aurora",
      aurora_design_id: json["design"]["id"],
      aurora_design_requested_at: Time.now
    )
  end

  def design_url(project_id, design_id)
    "https://#{host_url}/projects/#{project_id}/designs/#{design_id}/cad"
  end

  def project_url(project_id)
    "https://#{host_url}/projects/#{project_id}"
  end

  def project_find_or_search(proposal)
    if !proposal.aurora_project_id.nil?
      project_url(proposal.aurora_project_id)
    else
      project_search(proposal.address.street)
    end
  end

  def project_search(search_terms)
    "https://#{host_url}/projects?query=#{search_terms}"
  end

  def list_designs(project_id)
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/projects/#{project_id}/designs")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    request.body = {}.to_json
    response = http.request(request)
    # puts response.read_body
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def list_design_requests
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/design_requests")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    request.body = {}.to_json
    response = http.request(request)
    # puts response.read_body
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def create_design_request(proposal)
    # https://docs.aurorasolar.com/reference/createdesignrequest
    # sla = ETA in minutes until request completion from submission time. Default is 180. Set to 30 to expedite a request.

    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/design_requests")
    project_id = proposal.aurora_project_id
    expedite = ((proposal.appointment.start_at - Time.now) / 60).to_i <= 120 # in minutes, how soon the appointment is scheduled for determines how they should prioritize the proposal
    sla = expedite ? 30 : 180

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    request.body = {
      design_request:
        {
          project_id: project_id,
          latitude: proposal.address.latitude,
          longitude: proposal.address.longitude,
          sla: sla
        }
    }.to_json

    response = http.request(request)
    json = JSON.parse(response.read_body)
    abort if json["error"].present?

    # If a design is requested through pwrstation, it will save the design id. If it was created in aurora, then the api has been erroring when there is one in progress and returning the design_id. We can then save the id to the proposal.
    # TODO: What happens if one is already done and we request it to be done again. Will it request a new one or will it error and say that one was previously done?
    aurora_design_id = if json["design_request"].nil?
      json["meta"]["design_request_id"]
    else
      json["design_request"]["id"]
    end
    proposal.update(aurora_design_id: aurora_design_id, aurora_design__requested_at: Time.now)
    # puts response.read_body
  end

  def accept_design_model(proposal)
    # project_id = proposal.aurora_project_id # Unused variable
    design_id = proposal.aurora_design_id? # TODO, not sure how we'll handle this in the future.
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/design_requests/#{design_id}/accept")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"

    response = http.request(request)
    # puts response.read_body
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def list_financings(design_id)
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/designs/#{design_id}/financings")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"

    response = http.request(request)
    # puts response.read_body
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def design_summary(design_id)
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/designs/#{design_id}/summary")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"
    response = http.request(request)
    # puts response.read_body
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def design_assets(design_id)
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/designs/#{design_id}/assets")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{bearer_token}"

    response = http.request(request)
    # puts response.read_body

    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def auto_designer_start(design_id)
    url = URI("https://#{host_api}/v2/tenants/#{tenant_id}/designs/#{design_id}/auto_designer/run")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"

    response = http.request(request)
    # puts response.read_body/
    # json = JSON.parse(response.read_body)
    JSON.parse(response.read_body)
  end

  def auto_designer_status
  end

  def auto_designer_webhook
  end

  private

  def get_request(url)
  end
end
