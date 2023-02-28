# == Schema Information
#
# Table name: users
#
#  id                            :bigint           not null, primary key
#  accepted_privacy_at           :datetime
#  accepted_terms_at             :datetime
#  active                        :boolean          default(FALSE)
#  admin                         :boolean
#  announcements_read_at         :datetime
#  archived                      :boolean          default(FALSE), not null
#  aurora_user_active            :boolean          default(FALSE)
#  birth_date                    :date
#  canvass_user_active           :boolean
#  confirmation_sent_at          :datetime
#  confirmation_token            :string
#  confirmed_at                  :datetime
#  email                         :string           default(""), not null
#  encrypted_password            :string           default(""), not null
#  end_date                      :date
#  end_reason                    :string
#  extra_salesforce_account_ids  :text             default([]), is an Array
#  first_name                    :string
#  invitation_accepted_at        :datetime
#  invitation_created_at         :datetime
#  invitation_limit              :integer
#  invitation_sent_at            :datetime
#  invitation_token              :string
#  invitations_count             :integer          default(0)
#  invited_by_type               :string
#  last_name                     :string
#  last_otp_timestep             :integer
#  last_seen_at                  :datetime
#  onboarding_checklist_complete :boolean          default(FALSE)
#  otp_backup_codes              :text
#  otp_required_for_login        :boolean
#  otp_secret                    :string
#  permissions                   :jsonb            not null
#  personal_email                :string
#  phone                         :string
#  preferred_language            :string
#  remember_created_at           :datetime
#  reset_password_sent_at        :datetime
#  reset_password_token          :string
#  shirt_size                    :string
#  shoe_size                     :string
#  start_date                    :date
#  time_zone                     :string
#  unconfirmed_email             :string
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  aurora_user_id                :text
#  canvass_user_id               :string
#  invited_by_id                 :bigint
#  job_position_id               :bigint
#  salesforce_account_id         :string
#  secure_public_id              :string
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
#  index_users_on_secure_public_id                   (secure_public_id) UNIQUE
#

class User < ApplicationRecord
  include ActionText::Attachable
  include TwoFactorAuthentication
  include UserAccounts
  include UserAgreements

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, and :trackable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :confirmable, :masqueradable, :omniauthable

  has_noticed_notifications
  has_person_name
  has_secure_token :secure_public_id, length: 40 # https://github.com/rails/rails/blob/main/activerecord/lib/active_record/secure_token.rb

  # scope active_rep, -> { where(active: true) }
  scope :sorted, -> { order(active: :desc, last_seen_at: :desc, first_name: :desc, last_name: :desc) }

  # Add user permissions to this line
  # Do NOT to use any reserved words like `user` or `account`
  # default_permissions = ActiveRecord::Base.connection.tables.map { |x| x.to_sym }.sort
  default_permissions = [:account_invitations, :account_users, :accounts, :action_text_embeds, :action_text_rich_texts, :active_storage_attachments, :active_storage_blobs, :active_storage_variant_records, :addresses, :adjustments, :announcements, :api_tokens, :applicants, :appointments, :ar_internal_metadata, :contact_addresses, :contact_appointments, :contacts, :departments, :dynamic_forms, :earning_rates, :earning_types, :earnings, :events, :feedbacks, :field_configs, :field_responses, :finance_partners, :form_configs, :form_responses, :installers, :job_positions, :note_user_permissions, :notes, :notification_tokens, :notifications, :pay_charges, :pay_subscriptions, :payout_line_items, :payout_rate_variants, :payouts, :pending_job_positions, :plans, :project_feeds, :projects, :proposals, :schema_migrations, :taggings, :tags, :upline_relations, :user_connected_accounts, :users, :votes]
  whitelisted_permissions = [
    :energy_consumptions,
    :user_permissions,
    :attachments,
    # Calendar Views
    :calendars,
    :calendar_notes,
    :calendar_views,
    :documents,
    # Custom Permissions
    :applicants_custom, # TODO: Add explanatory note here
    :proposals_custom, # link and unlink a proposal in pwrstation to an aurora project
    :users_custom, # TODO: Add explanatory note here
    # Concessions
    :concessions,
    # Project Notes
    :all_project_notes,
    :contests,
    :referrals,
    # Proposal
    :default_proposal_quality_check,
    # Funding
    :fundings,
    :funding_payments
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

  permissions = (default_permissions + whitelisted_permissions - blacklisted_permissions - unneeded_permissions).sort
  PERMISSIONS = permissions.map { |x| ["can_manage_#{x}", "can_view_#{x}"] }.flatten

  # ActiveStorage Associations
  has_one_attached :avatar
  has_many_attached :documents
  acts_as_tagger

  # Associations
  has_many :api_tokens, dependent: :destroy
  has_many :applicants
  has_many :appointments, as: :scheduled_by
  has_many :appointments, as: :created_by
  has_many :connected_accounts, dependent: :destroy
  has_many :contacts
  has_many :events
  has_many :feedbacks
  has_many :field_marketers, class_name: "User", foreign_key: "default_consultant_id"
  has_many :field_responses, as: :last_updated_by, dependent: :nullify
  has_many :notes
  has_many :notifications, as: :recipient, dependent: :destroy
  has_many :notification_tokens, dependent: :destroy
  has_many :pending_job_positions, dependent: :destroy
  has_many :user_filters, dependent: :destroy
  has_many :payouts
  has_many :payout_rate_variants, through: :payouts
  has_many :earnings, through: :payout_rate_variants

  belongs_to :job_position

  # We don't need users to confirm their email address on create,
  # just when they change it
  before_create :skip_confirmation!
  after_commit :sync_salesforce_account, on: [:create, :update]
  before_save :activate_applicant, if: :active_changed?
  after_create :link_applicant, :default_start_date, :fix_appointments_created_by
  before_save :normalize_phone

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:id, :first_name, :last_name, :email, :personal_email, :phone, :salesforce_account_id, :canvass_user_id, :secure_public_id, :aurora_user_id],
    associated_against: {
      accounts: [:name],
      job_position: [:name]
    },
    using: {tsearch: {prefix: true}}
  # This scope is used exclusively for the mentions controller.
  pg_search_scope :search_by_full_name, against: [:first_name, :last_name], using: {tsearch: {prefix: true}}

  # Validations
  VALID_EMAILS = %w[horizonpwr\.com].freeze
  validates :name, :first_name, :last_name, presence: true
  validate :validate_email_formats # TODO: Turn this back on after we have imported data from Salesforce to production
  # validates :phone, phone: true, allow_blank: true
  validate :personal_email_format
  # Store the roles in the roles json column and cast to booleans
  store_accessor :permissions, *PERMISSIONS

  # TODO: It would be nice to have a scope for job positions or departments or something by default
  # JobPosition.all.each do |job_position|
  #   scope job_position.name.parameterize.pluralize.gsub('-','_'), -> { where("job_position.names @> ?", {job_position => true}.to_json) }
  # end

  def self.hr
    department_users("Human Resources")
  end

  def self.sales_managers
    # Department.first is Sales, but breaks the tests because the departments get loaded differently in testing.
    sales_dept = Department.find_by(name: "Sales")
    job_positions = sales_dept.job_positions.where(leadership: true).map(&:id)
    User.where(job_position: job_positions)
  end

  def self.sales
    department_users("Sales")
  end

  def self.developers
    department_users("IT")
  end

  def self.support
    department_users("Sales Support")
  end

  def self.field_marketers
    sales_dept = Department.find_by(name: "Sales")
    job_positions = sales_dept.job_positions.where(leadership: false).and(sales_dept.job_positions.where("name like ?", "%Field%")).map(&:id).uniq
    User.where(job_position: job_positions).where(active: true).includes(:accounts, :job_position).with_attached_avatar.order("first_name ASC, last_name ASC")
  end

  def self.closers
    # Department.first is Sales, but breaks the tests because the departments get loaded differently in testing.
    sales_dept = Department.find_by(name: "Sales")
    closer_job_positions = sales_dept.job_positions.where(leadership: true).or(sales_dept.job_positions.where(name: "Energy Consultant")).map(&:id).uniq
    User.where(job_position: closer_job_positions).where(active: true)
  end

  def self.funding
    department_users("Funding")
  end

  def self.solar_installers
    department_users("Install Crew")
  end

  def self.department_users(department)
    dept = Department.find_by(name: department)
    job_positions = dept.job_positions.where(active: true).map(&:id).uniq
    User.where(job_position: job_positions).where(active: true)
  end

  def self.project_managers
    pm_dept = Department.find_by(name: "Project Managers")
    job_positions = pm_dept.job_positions.where(leadership: false).and(pm_dept.job_positions.where("name like ?", "%Project Manager%")).map(&:id).uniq
    User.where(job_position: job_positions).where(active: true).includes(:accounts, :job_position).with_attached_avatar.order("first_name ASC, last_name ASC")
  end

  def project_manager?
    User.project_managers.include?(self)
  end

  def solar_installer?
    User.solar_installers.include?(self)
  end

  def funding?
    User.funding.include?(self)
  end

  def support?
    User.support.include?(self)
  end

  def sales?
    User.sales.include?(self)
  end

  def developer?
    User.developers.include?(self)
  end

  def closer?
    User.closers.include?(self)
  end

  def this_week_created_appointments
    Appointment.created_this_week
  end

  def this_week_scheduled_appointments
    Appointment.scheduled_this_week
  end

  def this_week_leads_count
    this_week_created_appointments.where(created_by_id: id).leads.uniq { |lead| lead.address_id }.size
  end

  def this_week_created_by_quality_sits_count
    this_week_scheduled_appointments.where(created_by_id: id).quality_sits.uniq { |lead| lead.address_id }.size
  end

  def this_week_scheduled_with_quality_sits_count
    this_week_scheduled_appointments.where(scheduled_with_id: id).quality_sits.uniq { |lead| lead.address_id }.size
  end

  def this_week_assists_count
    this_week_created_appointments.where(created_by_id: id).assists.size
  end

  def this_week_scheduled_installs_count
    this_week_created_appointments.where(scheduled_with_id: id).scheduled_installs.size
  end

  def this_fm_week_points
    this_week_leads_count +
      (this_week_created_by_quality_sits_count * 2) +
      (this_week_assists_count * 25)
  end

  def this_closers_week_points
    (this_week_scheduled_with_quality_sits_count * 2) +
      (this_week_scheduled_installs_count * 25)
  end

  def self.days_old(day_number)
    User.where("Date(created_at) > ?", Date.today - day_number.to_i)
  end

  # Cast roles to/from booleans
  PERMISSIONS.each do |permission|
    scope permission.to_s.pluralize, -> { where("permissions @> ?", {permission => true}.to_json) }
    define_method(:"#{permission}=") { |value| super ActiveRecord::Type::Boolean.new.cast(value) }
    define_method(:"#{permission}?") { send(permission) }
  end

  def can_view?(permission)
    # NOTE: Do not use this method in views. This is intended for use in Policies
    can?("view", permission)
  end

  def can_manage?(permission)
    # NOTE: Do not use this method in views. This is intended for use in Policies
    can?("manage", permission)
  end

  def upline
    UplineRelation.find_by(downline: self, active: true)&.upline
    # UplineRelation.find_by(downline: manager, active: true)
  end

  def appointments
    Appointment.where("created_by_id = ? OR scheduled_with_id = ?", id, id)
  end

  def tenure_in_weeks
    (Date.today - start_date).to_i / 7
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

  def valid_work_email?
    VALID_EMAILS.each do |email_format|
      return true if /.+@#{email_format}$/.match?(email.to_s)
    end
    false
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
    %w[4 5 6 7 8 9 10 11 12 13 14]
  end

  def shirt_sizes
    %w[Small Medium Large X-Large 2X-Large 3X-Large]
  end

  def owns_attachment?(attachment)
    admin? || support? || id == attachment.user_id
  end

  def self.user_select(job_position)
    job_ids = JobPosition.where("name like ? OR name like ?", "%#{job_position}%", "%Manager%").map(&:id)
    User.where(active: true).where(job_position_id: job_ids).order(first_name: :asc)
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

  def sync_salesforce_account
    if salesforce_account_id.nil?
      SalesforceClient.new.user_create(self)
    else
      SalesforceClient.new.user_update(self)
    end
  end

  def activate_applicant
    if active == true && applicants.any?
      applicant = applicants.last
      applicant.status = "activated"
      applicant.save(validate: false)
    end
  end

  def link_applicant
    @applicant = Applicant.where(new_email: email).last
    if @applicant.present?
      @applicant.user = self
      @applicant.save(validate: false)
      update(job_position_id: @applicant.job_position.id) if @applicant.job_position_id.present?
      add_user_to_applicant_account(@applicant.account)
    end
  end

  def default_start_date
    self.start_date ||= Date.today
  end

  # User.where.not(canvass_user_id: nil).each do |user|
  #  user.fix_appointments_created_by
  # end

  def fix_appointments_created_by
    CanvassClient.new.update_appointments_created_by(self)
  end

  def add_user_to_applicant_account(account)
    if account.present?
      account_user = AccountUser.find_or_initialize_by(account: account, user_id: id)
      account_user.roles[:member] = true
      account_user.save
    end
  end

  def canvass_link
    "https://admin.saleshub.io/employees/edit/#{canvass_user_id}"
  end

  def sf_account_link
    "https://horizonpower.lightning.force.com/lightning/r/Account/#{salesforce_account_id}/view?ws=%2Flightning%2Fr%2FResidential_Projects__c%2Fa003m00002HgSBfAAN%2Fview"
  end

  def deactivate_user!
    DeactivateUserNotification.with(user: self, requested_by: current_user).deliver_later(User.hr)
    CanvassClient.new.employee_deactivate(self) if canvass_user_id.present?
    update!(active: false, canvass_user_active: false)
  end

  def document_links
    query_params = "?ref=#{Rails.env.first}&user_id=#{current_user.secure_public_id}"

    if job_position.name == "Sales Support"
      {
        "Sales Support Contact" => "https://onboarding.horizonpwr.com/sales-support-contract/#{query_params}"
      }
    elsif job_position.name == "Solar Install Technician"
      {"Installer Contract" => "https://onboarding.horizonpwr.com/installer-contract/#{query_params}"}
    elsif job_position.name == "Master Electrician"
      {"Master Electrician" => "https://onboarding.horizonpwr.com/electrician-master-contract/#{query_params}"}
    elsif job_position.name == "Journeyman Electrician"
      {"Journeyman Electrician" => "https://onboarding.horizonpwr.com/electrician-journeyman-contract/#{query_params}"}
    elsif job_position.name == "Apprentice Electrician"
      {"Apprentice Electrician" => "https://onboarding.horizonpwr.com/electrician-apprentice-contract/#{query_params}"}
    elsif job_position.name == "Project Manager"
      {"Project Manager Contact" => "https://onboarding.horizonpwr.com/project-managers-contract/#{query_params}"}
    elsif job_position.name == "Project Manager Assistant"
      {
        "Project Manager Contact" => "https://onboarding.horizonpwr.com/project-manager-assistant-agreement/#{query_params}"
      }
    elsif job_position.name == "Sales Manager"
      {
        "Sales Manager Contact" => "https://onboarding.horizonpwr.com/branch-manager-agreement/#{query_params}",
        "W9" => "https://onboarding.horizonpwr.com/w9-form/#{query_params}",
        "Direct Deposit" => "https://onboarding.horizonpwr.com/employee-direct-deposit-authorization/#{query_params}"
      }
    elsif job_position.name == "Energy Consultant"
      {
        "Energy Consultant Agreement" => "https://onboarding.horizonpwr.com/energy-consultant-agreement/#{query_params}",
        "W9" => "https://onboarding.horizonpwr.com/w9-form/#{query_params}",
        "Direct Deposit" => "https://onboarding.horizonpwr.com/employee-direct-deposit-authorization/#{query_params}"
      }
    else
      {
        "Field Marketer Agreement" => "https://onboarding.horizonpwr.com/field-marketer-agreement/#{query_params}",
        "W9" => "https://onboarding.horizonpwr.com/w9-form/#{query_params}",
        "Direct Deposit" => "https://onboarding.horizonpwr.com/employee-direct-deposit-authorization/#{query_params}"
      }
    end
    # "EC Agreement" => "https://onboarding.horizonpwr.com/energy-consultant-agreement/#{query_params}",
    # "Manager Agreement" => "https://onboarding.horizonpwr.com/branch-manager-agreement/#{query_params}",
  end

  private

  def can?(action, permission = nil)
    permissions["can_#{action}_#{permission}"] == true
  end
end
