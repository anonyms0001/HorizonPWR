# frozen_string_literal: true

# == Schema Information
#
# Table name: contacts
#
#  id                        :bigint           not null, primary key
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
#  canvass_contact_id        :string
#  salesforce_lead_id        :string
#  salesforce_opportunity_id :string
#  user_id                   :bigint
#
# Indexes
#
#  index_contacts_on_account_id  (account_id)
#  index_contacts_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
class Contact < ApplicationRecord
  # TODO: Validate and normalize phone column
  # https://justincypret.com/blog/validating-normalizing-and-formatting-phone-numbers-in-rails
  has_many :contact_appointments, dependent: :destroy
  has_many :appointments, through: :contact_appointments
  has_many :contact_addresses, dependent: :destroy
  has_many :addresses, through: :contact_addresses
  has_many :projects, through: :contact_addresses

  belongs_to :account
  belongs_to :user

  before_save :normalize_phone

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
end
