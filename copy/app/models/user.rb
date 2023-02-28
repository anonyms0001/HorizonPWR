# == Schema Information
#
# Table name: users
#
#  id                           :bigint           not null, primary key
#  accepted_privacy_at          :datetime
#  accepted_terms_at            :datetime
#  active                       :boolean          default(FALSE)
#  admin                        :boolean
#  announcements_read_at        :datetime
#  birth_date                   :date
#  confirmation_sent_at         :datetime
#  confirmation_token           :string
#  confirmed_at                 :datetime
#  email                        :string           default(""), not null
#  encrypted_password           :string           default(""), not null
#  end_date                     :date
#  end_reason                   :string
#  extra_salesforce_account_ids :text             default([]), is an Array
#  first_name                   :string
#  invitation_accepted_at       :datetime
#  invitation_created_at        :datetime
#  invitation_limit             :integer
#  invitation_sent_at           :datetime
#  invitation_token             :string
#  invitations_count            :integer          default(0)
#  invited_by_type              :string
#  last_name                    :string
#  last_otp_timestep            :integer
#  otp_backup_codes             :text
#  otp_required_for_login       :boolean
#  otp_secret                   :string
#  permissions                  :jsonb            not null
#  personal_email               :string
#  phone                        :string
#  preferred_language           :string
#  remember_created_at          :datetime
#  reset_password_sent_at       :datetime
#  reset_password_token         :string
#  shirt_size                   :string
#  shoe_size                    :string
#  start_date                   :date
#  time_zone                    :string
#  unconfirmed_email            :string
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  canvass_user_id              :string
#  invited_by_id                :bigint
#  job_position_id              :bigint
#  salesforce_account_id        :string
#
# Indexes
#
#  index_users_on_email                              (email) UNIQUE
#  index_users_on_invitation_token                   (invitation_token) UNIQUE
#  index_users_on_invitations_count                  (invitations_count)
#  index_users_on_invited_by_id                      (invited_by_id)
#  index_users_on_invited_by_type_and_invited_by_id  (invited_by_type,invited_by_id)
#  index_users_on_job_position_id                    (job_position_id)
#  index_users_on_reset_password_token               (reset_password_token) UNIQUE
#

class User < ApplicationRecord
  include ActionText::Attachable
  include TwoFactorAuthentication
  include UserAccounts
  include UserAgreements

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, andle :trackable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :confirmable, :masqueradable, :omniauthable

  has_noticed_notifications
  has_person_name

  # scope active_rep, -> { where(active: true) }

  # Add user permissions to this line
  # Do NOT to use any reserved words like `user` or `account`
  whitelisted_permissions = [
    # Project Notes
    :all_project_notes,
    # Proposal
    :default_proposal_quality_check
  ]
  unneeded_permissions = [
    :announcements,
    :earnings,
    :earning_rates,
    :events,
    :field_configs,
    :field_responses,
    :form_configs, # Action policy methods seem to still be working with this blacklisted here.
    :form_responses,
    :votes
  ]
  blacklisted_permissions = [
    :action_text_rich_texts,
    :active_storage_attachments,
    :active_storage_blobs,
    :active_storage_variant_records,
    :account_invitations,
    :action_text_embeds,
    :api_tokens,
    :ar_internal_metadata,
    :note_user_permissions,
    :notification_tokens,
    :pay_charges,
    :pay_subscriptions,
    :payout_line_items,
    :payout_rate_variants,
    :plans,
    :project_feeds,
    :taggings,
    :tags,
    :user_connected_accounts,
    :schema_migrations
  ]

  permissions = (whitelisted_permissions - blacklisted_permissions - unneeded_permissions).sort
  PERMISSIONS = permissions.map { |x| ["can_manage_#{x}", "can_view_#{x}"] }.flatten

  # ActiveStorage Associations
  has_one_attached :avatar
  has_many_attached :documents
  acts_as_tagger

  # Associations
  has_many :api_tokens, dependent: :destroy
  has_many :connected_accounts, dependent: :destroy
  has_many :notifications, as: :recipient, dependent: :destroy
  has_many :field_marketers, class_name: "User", foreign_key: "default_consultant_id"
  has_many :appointments, as: :scheduled_by
  has_many :appointments, as: :created_by
  has_many :contacts
  has_many :feedbacks
  has_many :notes
  has_many :events
  has_many :notification_tokens, dependent: :destroy
  has_many :field_responses, as: :last_updated_by, dependent: :nullify

  belongs_to :job_position, optional: true

  # We don't need users to confirm their email address on create,
  # just when they change it
  before_create :skip_confirmation!
  before_save :normalize_phone

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:id, :first_name, :last_name],
    associated_against: {
      accounts: [:name],
      job_position: [:name]
    },
    using: {tsearch: {prefix: true}}
  # This scope is used exclusively for the mentions controller.
  pg_search_scope :search_by_full_name, against: [:first_name, :last_name], using: {tsearch: {prefix: true}}

  # Validations
  VALID_EMAILS = %w[horizonpwr\.com].freeze
  validates :name, presence: true
  # validate :validate_email_formats        #TODO: Turn this back on after we have imported data from Salesforce to production
  # validates :phone, phone: true, allow_blank: true
  validate :personal_email_format
  # Store the roles in the roles json column and cast to booleans
  store_accessor :permissions, *PERMISSIONS

  # Cast roles to/from booleans
  PERMISSIONS.each do |permission|
    scope permission.to_s.pluralize, -> { where("permissions @> ?", {permission => true}.to_json) }
    define_method(:"#{permission}=") { |value| super ActiveRecord::Type::Boolean.new.cast(value) }
    define_method(:"#{permission}?") { send(permission) }
  end

  def can_view?(permission)
    can?("view", permission)
  end

  def can_manage?(permission)
    can?("manage", permission)
  end

  def appointments
    Appointment.where("created_by_id = ? OR scheduled_with_id = ?", id, id)
  end

  def personal_email_format
    return unless personal_email.present? # allow blank
    return if personal_email.to_s&.match?(Devise.email_regexp) # allow if passes devise email validation
    errors.add(:personal_email, "must be a valid email address")
  end

  def validate_email_formats
    VALID_EMAILS.each do |email_format|
      return true if /.+@#{email_format}$/.match?(email.to_s)
    end
    errors.add(:email, "must be a work email address. ie: @horizonpwr.com")
  end

  def normalize_phone
    self.phone = Phonelib.parse(phone).full_e164.presence
  end

  def positions
    JobPosition.select("id", "name")
  end

  def job_position_name
    job_position.present? ? job_position.name : "Job position not assigned"
  end

  def self.select_options(job_position = nil)
    if job_position
      User.joins(:job_position).where("name LIKE ?", "%#{job_position}").where(active: true).order(first_name: :asc)
    else
      User.where(active: true)
    end
  end

  def shoe_sizes
    [
      "Small",
      "Medium",
      "Large",
      "X-Large",
      "2X-Large",
      "3X-Large"
    ]
  end

  def shirt_sizes
    [
      "Small",
      "Medium",
      "Large",
      "X-Large",
      "2X-Large",
      "3X-Large"
    ]
  end

  # this was a temporary thing for display purposes only.
  def team_name
    if accounts.impersonal.present?
      accounts.impersonal.first.name
    else
      "No Team"
    end
  end

  def sales_representative
    self.job_position_id = [1, 2, 3, 4, 6, 7, 8, 9, 14]
  end

  def active?
    active
  end

  private

  def can?(action, permission = nil)
    permissions["can_#{action}_#{permission}"] == true
  end
end
