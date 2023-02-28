# == Schema Information
#
# Table name: addresses
#
#  id                        :bigint           not null, primary key
#  address                   :string
#  address_type              :string
#  archived                  :boolean          default(FALSE), not null
#  city                      :string
#  latitude                  :decimal(, )
#  longitude                 :decimal(, )
#  number                    :string
#  postal_code               :string
#  state                     :string
#  street                    :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  canvass_address_id        :string
#  salesforce_lead_id        :string
#  salesforce_opportunity_id :string
#
# Indexes
#
#  index_addresses_on_canvass_address_id         (canvass_address_id)
#  index_addresses_on_salesforce_lead_id         (salesforce_lead_id)
#  index_addresses_on_salesforce_opportunity_id  (salesforce_opportunity_id)
#
class Address < ApplicationRecord
  has_many :projects
  has_many :proposals
  has_many :appointments
  has_many :contact_addresses, dependent: :destroy
  has_many :contacts, through: :contact_addresses
  has_many :earnings
  has_many :notes, as: :notable

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:address, :address_type, :city, :number, :postal_code, :state, :street],
    associated_against: {
      contacts: [:first_name, :last_name, :email, :phone]
    },
    using: {tsearch: {prefix: true}}

  def name
    contacts&.first&.name || "Unknown"
  end

  def created_by_name
    contacts&.user&.name || "unknown"
  end

  def created_by_team
    created_by&.account&.name || "unknown"
  end

  def scheduled_with_name
    scheduled_with&.user&.name || "unknown"
  end

  def link_google_maps
    "https://www.google.com/maps/search/?api=1&query=#{full_address}"
  end

  def display_city
    # TODO: Concerned about data integrity. This is sometimes missing.
    city.present? ? " - #{city}" : ""
  end

  def self.find_or_create_by_canvass(json)
    canvass_address_id = json["id"]

    attributes = {
      latitude: json["lat"],
      longitude: json["lng"],
      address_type: "residential",
      street: json["street"],
      city: json["city"],
      state: json["region"],
      postal_code: json["postal"],
      canvass_address_id: canvass_address_id,
      number: json["number"]
    }

    find_by(canvass_address_id: canvass_address_id) ||
      find_by(attributes.except(:canvass_address_id)) ||
      create(attributes)
  end

  def full_address
    address || "#{number} #{street} #{city} #{state}, #{postal_code}" || "Blank"
  end
end
