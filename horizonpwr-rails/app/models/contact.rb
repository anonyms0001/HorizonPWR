# frozen_string_literal: true

# == Schema Information
#
# Table name: contacts
#
#  id                        :bigint           not null, primary key
#  archived                  :boolean          default(FALSE), not null
#  birth_date                :datetime
#  email                     :string
#  first_name                :string
#  gender                    :boolean
#  last_name                 :string
#  lead_source               :string
#  phone                     :string
#  phone1                    :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  account_id                :bigint
#  active_campaign_id        :integer
#  canvass_contact_id        :string
#  salesforce_lead_id        :string
#  salesforce_opportunity_id :string
#  secure_public_id          :string
#  user_id                   :bigint
#
# Indexes
#
#  index_contacts_on_account_id                 (account_id)
#  index_contacts_on_active_campaign_id         (active_campaign_id) UNIQUE
#  index_contacts_on_canvass_contact_id         (canvass_contact_id)
#  index_contacts_on_salesforce_lead_id         (salesforce_lead_id)
#  index_contacts_on_salesforce_opportunity_id  (salesforce_opportunity_id)
#  index_contacts_on_secure_public_id           (secure_public_id) UNIQUE
#  index_contacts_on_user_id                    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)

class Contact < ApplicationRecord
  # TODO: Validate and normalize phone column
  # https://justincypret.com/blog/validating-normalizing-and-formatting-phone-numbers-in-rails
  has_many :contact_appointments, dependent: :destroy
  has_many :appointments, through: :contact_appointments
  has_many :contact_addresses, dependent: :destroy
  has_many :addresses, through: :contact_addresses
  has_many :projects, through: :contact_addresses

  def referrals
    Referral.where("referral_contact_id = ?
    OR referrer_contact_id = ?",
      id, id)
  end

  belongs_to :account, optional: true
  belongs_to :user, optional: true

  accepts_nested_attributes_for :addresses
  accepts_nested_attributes_for :appointments

  before_save :normalize_phone
  has_person_name
  has_secure_token :secure_public_id, length: 40 # https://github.com/rails/rails/blob/main/activerecord/lib/active_record/secure_token.rb

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:first_name, :last_name, :email, :gender, :phone],
    associated_against: {
      addresses: [:address, :address_type, :city, :number, :postal_code, :state, :street]
    },
    using: {tsearch: {prefix: true}}

  def normalize_phone
    self.phone = Phonelib.parse(phone).full_e164.presence
    self.phone1 = Phonelib.parse(phone1).full_e164.presence
  end

  def name
    "#{first_name} #{last_name}"
  end

  def self.display_address_contacts(address, attribute)
    address.contacts.map(&attribute.to_sym).uniq.join(", ")
  end
end
