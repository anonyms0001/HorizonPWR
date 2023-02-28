# == Schema Information
#
# Table name: referrals
#
#  id                  :bigint           not null, primary key
#  eligible            :string           default("unchecked"), not null
#  email               :string           not null
#  first_name          :string           not null
#  last_name           :string           not null
#  phone               :string
#  referrer_address    :string
#  referrer_email      :string
#  referrer_first_name :string
#  referrer_last_name  :string
#  referrer_phone      :string
#  status              :string           default("to_contact"), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  contest_id          :bigint
#  referral_contact_id :bigint
#  referrer_contact_id :bigint
#  user_id             :integer
#
# Indexes
#
#  index_referrals_on_contest_id           (contest_id)
#  index_referrals_on_referral_contact_id  (referral_contact_id)
#  index_referrals_on_referrer_contact_id  (referrer_contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (contest_id => contests.id)
#  fk_rails_...  (referral_contact_id => contacts.id)
#  fk_rails_...  (referrer_contact_id => contacts.id)
#
class Referral < ApplicationRecord
  belongs_to :referrer_contact, class_name: "Contact", foreign_key: "referrer_contact_id", optional: true
  belongs_to :referral_contact, class_name: "Contact", foreign_key: "referral_contact_id", optional: true
  belongs_to :contest, optional: true
  belongs_to :user, optional: true
  # has_many :contacts, dependent: :nullify # ActiveRecord::StatementInvalid (PG::UndefinedColumn: ERROR:  column contacts.referral_id does not exist

  scope :between, ->(referral_contact_id, referrer_contact_id) do
    where("(referrals.referrer_contact_id = ?
      AND referrals.referral_contact_id =?)
      OR (referrals.referrer_contact_id = ?
      AND referrals.referral_contact_id =?)",
      referral_contact_id, referrer_contact_id, referrer_contact_id, referral_contact_id)
  end

  has_person_name

  validates :referrer_first_name, presence: true, unless: :referrer_contact_provided?
  validates :referrer_last_name, presence: true, unless: :referrer_contact_provided?
  validates :referrer_address, presence: true, unless: :referrer_contact_provided?
  validates :referrer_email, presence: true, unless: :referrer_contact_provided?
  # validates :referrer_phone, presence: true, unless: :referrer_contact_provided?
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :phone, presence: true
  validate :personal_email_format
  before_save :normalize_phone

  after_commit :add_active_campaign_tag_to_referrer, if: :saved_change_to_referrer_contact_id?

  def add_active_campaign_tag_to_referrer
    # Run when first saved, or if column was null and is now saved.
    ActiveCampaignClient.new.contact_add_tag(referrer_contact)
  end

  def normalize_phone
    self.phone = Phonelib.parse(phone).full_e164.presence
    self.referrer_phone = Phonelib.parse(referrer_phone).full_e164.presence
  end

  def personal_email_format
    return unless email.present? # allow blank
    return if email.to_s&.match?(Devise.email_regexp) # allow if passes devise email validation
    errors.add(:email, "must be a valid email address")
  end

  def self.referral_statuses
    [
      ["To Contact", "to_contact"], # (this is the default)
      ["In Contact", "in_contact"],
      ["No Contact", "no_contact"],
      ["Appointment Scheduled", "appointment_scheduled"],
      ["Lost", "lost"], # (sit not sold)
      ["Won", "won"] # (scheduled install)
    ]
  end

  def self.eligible_options
    [
      ["Unchecked", "unchecked"],
      ["True", "true"],
      ["False", "false"]
    ]
  end

  def active
    "Active"
  end

  private

  def referrer_contact_provided?
    referrer_contact_id.present?
  end

  def check_referrer
    if referrer_contact_id.nil?
      errors.add(:referrer_address, "cannot be blank")
      errors.add(:referrer_email, "cannot be blank")
      errors.add(:referrer_first_name, "cannot be blank")
      errors.add(:referrer_last_name, "cannot be blank")
      errors.add(:referrer_phone, "cannot be blank")
    end
  end
end
