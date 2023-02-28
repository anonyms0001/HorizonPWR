class ActiveCampaignClient
  attr_reader :client

  def initialize
    @client = ::ActiveCampaign::Client.new(
      api_url: "#{Rails.application.credentials.active_campaign[:url]}/api/3",
      api_token: Rails.application.credentials.active_campaign[:key],
      response_middleware: {},
      adapter: :net_http
    )
  end

  def search_contact(contact)
    ac = client.show_contacts(search: contact.email)
    # client.show_contacts(search: contact.secure_public_id) ||
    contact.update(active_campaign_id: ac[:contacts][0][:id]) if ac[:contacts].one?
  end

  def search_contact_email(email)
    contact = Contact.find_by(email: email)
    return false if contact.nil?

    ac = client.show_contacts(search: email)
    # client.show_contacts(search: contact.secure_public_id) ||
    contact.update(active_campaign_id: ac[:contacts][0][:id]) if ac[:contacts].one?
  end

  def contact_add_tag(contact, tag = 8)
    search_contact(contact) if contact.active_campaign_id.nil?
    params = {contact: contact.active_campaign_id, tag: 8}
    client.create_contact_tag(params)
  end

  def contact_payload(contact)
    {
      email: contact.email,
      first_name: contact.first_name,
      last_name: contact.last_name,
      phone: contact.phone,
      address_1: contact.addresses.first.full_address,
      city: contact.addresses.first.city,
      state: contact.addresses.first.state,
      contact_id: contact.id.to_s,
      fieldValues: [
        {
          field: "1", # Address
          value: contact.addresses.first.full_address
        },
        {
          field: "3", # City
          value: contact.addresses.first.city
        },
        {
          field: "2", # State
          value: contact.addresses.first.state
        },
        {
          field: "13", # env
          value: Rails.env.to_s
        },
        {
          field: "4", # Location Type
          value: "Residential" # Residential
        },
        {
          field: "14", # contact_id
          value: contact.id.to_s
        }
      ]
    }
  end

  def show_tags
    client.show_tags
  end

  def show_field_values
    client.show_field_values
  end

  def show_fields
    client.show_fields
  end

  # fieldValues
  # client.show_field_values
  # 1 Address
  # 2 State
  # 3 City
  # 4 Location Type
  # 5 Additional Details
  # 6 Referred Full Name
  # 7 Your Phone Number
  # 11 Referrer Email
  # 12 Your Email
  # 13 env
  # 14 contact_id

  def sync_contact(contact)
    response = client.sync_contact(
      contact_payload(contact)
    )
    contact.update(active_campaign_id: response[:contact][:id].to_i)
    # self.ac_id = ac_contact[:contact][:id]
  end

  def update_contact(contact)
    client.update_contact(
      contact.active_campaign_id,
      {
        email: contact.email,
        first_name: contact.first_name,
        last_name: contact.last_name,
        phone: contact.phone,
        fieldValues: [
          {
            field: "1",
            value: contact.addresses.first.full_address
          },
          {
            field: "3",
            value: contact.addresses.first.city
          },
          {
            field: "2",
            value: contact.addresses.first.state
          },
          {
            field: "14",
            value: contact.id.to_s
          },
          {
            field: "env",
            value: Rails.env.to_s
          },
          {
            field: "contact_id",
            value: contact.id.to_s
          }
        ]
      }
    )
  end

  def create_address(address, contact)
    client.create_address(
      company_name: "TEST",
      address_1: contact.addresses.first.full_address,
      city: contact.addresses.first.city,
      state: contact.addresses.first.state,
      zip: contact.addresses.first.postal_code,
      country: "US"
    )
  end

  def delete_contact(contact)
    client.delete_contact(
      contact.active_campaign_id
    )
  end

  def show_contact(contact)
    client.show_contact(contact.active_campaign_id)
  end

  def show_list(id = 2)
    client.show_list(id)
  end

  def update_active_campaign_contact
    ac_contact = client.sync_contact(
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      fieldValues: [
        {
          field: "env",
          value: Rails.env.to_s
        },
        {
          field: "user_id",
          value: id.to_s
        }
      ]
    )
    self.ac_id = ac_contact[:contact][:id]
  rescue JSON::ParserError
  end
end
