# == Schema Information
#
# Table name: addresses
#
#  id                        :bigint           not null, primary key
#  address                   :string
#  address_type              :string
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
class Address < ApplicationRecord
  has_many :projects
  has_many :proposals
  has_many :appointments
  has_many :contact_addresses, dependent: :destroy
  has_many :contacts, through: :contact_addresses
  has_many :earnings

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

  def full_address
    address || "#{street} #{city} #{state}, #{postal_code}" || "Blank"
  end

  def aurora_searchable
    "https://app.aurorasolar.com/projects?query=#{street}"
  end
end
