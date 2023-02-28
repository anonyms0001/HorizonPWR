# == Schema Information
#
# Table name: projects
#
#  id                                :bigint           not null, primary key
#  energy_efficiency_pack            :boolean
#  install_types                     :jsonb            not null
#  solar_array_count                 :integer
#  status                            :string           default("new")
#  system_size                       :decimal(, )
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  account_id                        :bigint
#  address_id                        :bigint
#  finance_partner_id                :bigint
#  installer_id                      :bigint
#  salesforce_opportunity_id         :string
#  salesforce_residential_project_id :string
#  sold_by_id                        :bigint
#
# Indexes
#
#  index_projects_on_account_id                         (account_id)
#  index_projects_on_address_id                         (address_id)
#  index_projects_on_finance_partner_id                 (finance_partner_id)
#  index_projects_on_installer_id                       (installer_id)
#  index_projects_on_salesforce_opportunity_id          (salesforce_opportunity_id)
#  index_projects_on_salesforce_residential_project_id  (salesforce_residential_project_id)
#  index_projects_on_sold_by_id                         (sold_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (finance_partner_id => finance_partners.id)
#  fk_rails_...  (installer_id => installers.id)
#  fk_rails_...  (sold_by_id => users.id)
#
class Project < ApplicationRecord
  INSTALL_TYPES = [:roof_mount, :ground_mount, :battery_backup]

  belongs_to :installer, optional: true
  belongs_to :finance_partner, optional: true
  belongs_to :address, optional: true
  belongs_to :account, optional: true
  belongs_to :sold_by, class_name: "User", optional: true

  has_many :contact_addresses
  has_many :contacts, through: :address
  has_many_attached :attachments
  has_many :tags, through: :attachments_attachments

  has_many :appointments
  has_many :proposals
  has_many :project_feeds, dependent: :destroy
  has_many :notes, as: :notable
  has_many :fundings, dependent: :destroy
  has_many :concessions
  has_many :earnings

  scope :created_this_year, -> { where("created_at > ? AND created_at < ?", DateTime.now.beginning_of_year, DateTime.now.end_of_year) }
  scope :created_this_week, -> { where("created_at > ? AND created_at < ?", DateTime.now.beginning_of_week, DateTime.now.end_of_week) }
  scope :created_on_given_week, ->(week) { where("created_at > ? AND created_at < ?", Date.commercial(2022, week, 1), (Date.commercial(2022, week, 7) + 1)) }
  scope :cancelled, -> { where(status: "cancelled") }
  scope :not_cancelled, -> { where.not(status: "cancelled") }

  after_create :trigger_earning_job
  after_create :update_sold_by
  before_validation :sanitize_salesforce_project_id
  validates_with SalesforceProjectIdValidator

  # Store the install types in the install types json column and cast to booleans
  store_accessor :install_types, *INSTALL_TYPES
  INSTALL_TYPES.each do |install_type|
    scope install_type.to_s.pluralize, -> { where("install_types @> ?", {install_type => true}.to_json) }
    define_method(:"#{install_type}=") { |value| super ActiveRecord::Type::Boolean.new.cast(value) }
    define_method(:"#{install_type}?") { send(install_type) }
  end

  # def consult
  #   # The reason find_by works instead of where, is because an address can have more than one consult appointment,
  #   # but the only way that a consult gets associated to a project is when a project is created.
  #   # thus any additional consults will either not be associated to a project, or they will be associated to a different project.
  #   # Like when someone wants to upgrade, or add a battery. That would be a separate consult.
  #   appointments.find_by(appointment_type: "consult", archived: false)
  # end

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:id],
    associated_against: {
      address: [:address, :address_type, :city, :number, :postal_code, :state, :street],
      contacts: [:first_name, :last_name, :email, :phone],
      appointments: :appointment_type,
      installer: [:name]
    },
    using: {tsearch: {prefix: true}}

  def trigger_earning_job
    CreateEarningJob.perform_later(project_id: id)
  end

  def self.project_consults
    Appointment.consults.where.not(project_id: nil)
  end

  def self.scheduled_install_consults_created_this_week
    project_consults.where(project_id: created_this_week.ids)
  end

  def self.scheduled_install_consults_created_on_given_week(week, account_id)
    project_consults.where(project_id: created_on_given_week(week).ids).where(account_id: account_id)
  end

  # NOTE: do we have any projects, installs that do not have an account?
  def consult
    appointments.find_by(appointment_type: "consult", archived: false) ||
      appointments.find_by(appointment_type: "consult")
  end

  def name
    display_name
  end

  def sorted_tags
    tags.uniq.sort
  end

  def all_tags
    (sorted_tags.map(&:name) | required_tags | needed_tags | available_tags).uniq.sort
  end

  def display_name
    address&.contacts&.first&.name || "Unknown"
  end

  def display_system_size
    # TODO: Concerned about data integrity. This is sometimes missing.
    system_size || "?"
  end

  # ActiveStorage Associations
  # These are tags that are applied by default when an ec or an installer is adding attachments. They cannot remove these tags.
  def required_tags
    ["install", "site audit"].sort
  end

  # These are tags that will show up as missing on a project if they are not included
  def needed_tags
    %w[
      meter
      roof
      attic
      breaker
      finance
      bill
    ].sort
  end

  # These are all of the predefined tags that a user can select from.
  def available_tags
    (required_tags | needed_tags | %w[
      hud-plate
      datasheet
      paystub
      $99
      identification
      aerial
      amp-max
      rafter
      measurements
    ]).uniq.sort
  end

  # These are the tags that we indicate are missing on a project show page
  def missing_tags
    (needed_tags - tags.map(&:name).uniq).sort
  end

  def status_options
    %w[complete cancelled pending_cancel site_audit_scheduled install_scheduled coc_signed inspection_scheduled pto_requested pto_approved]
    # TODO: schedule job to switch pending_cancel to cancelled after 2.weeks
  end

  def last_project_appointment
    Appointment.where(project_id: id)&.last&.appointment_type
  end

  def status
    # Appointment.find(project_id: self.id, appointment_type: 'install').appointment_status
    pending_install = Appointment.where(project_id: id, appointment_type: "install")&.first
    unless pending_install.present?
      return last_project_appointment
    end
    pending_install&.appointment_status
  end

  def finance_partner_selector
    finance_partner || FinancePartner.find_by(name: "Generations")
  end

  def installer_name
    installer_id.present? ? Installer.find(installer_id).name : "No Installer"
  end

  def update_sold_by
    update(account: consult.account, sold_by: consult.scheduled_with) if consult.present?
  end

  def sanitize_salesforce_project_id
    string = "Residential_Projects__c/"
    if salesforce_residential_project_id_changed? && salesforce_residential_project_id.include?(string)
      # "https://horizonpower.lightning.force.com/lightning/r/Residential_Projects__c/a003m00002Qy64AAAR/view"
      self.salesforce_residential_project_id =
        salesforce_residential_project_id.partition(string).last[0..17]
    end
  end

  def valid_salesforce_project_id?
    return false unless salesforce_residential_project_id.present? && salesforce_residential_project_id.length == 18
    false unless SalesforceClient.new.find_project(salesforce_residential_project_id).present?
  end

  def clean_project(arr)
    project = Project.find(arr[0])
    account = Account.find_by(id: arr[1]) || project.account
    sold_by = User.find_by(id: arr[2]) || project.sold_by
    project.change_account_and_sold_by(account, sold_by)
  end

  # def arrs
  #   [
  #     # ['project', 'account', 'user'],
  #     [146,0,323],
  #     [154,0,832],
  #     [248,0,0],
  #     [275,0,137],
  #     [311,0,137],
  #     [180,0,832]
  #     [426,3,1004]
  #   # [0,0,0],
  #     # []
  #   ]
  # end
  # arrs.each do |arr|
  #   clean_project(arr)
  # end

  def salesforce_url
    if salesforce_residential_project_id.present?
      "https://horizonpower.lightning.force.com/lightning/r/Residential_Projects__c/#{salesforce_residential_project_id}/view"
    else
      ""
    end
  end

  def change_account_and_sold_by(account, sold_by = self.sold_by)
    ActiveRecord::Base.transaction do
      appointments.update_all(scheduled_with_id: sold_by.id, account_id: account.id)
      contacts.update_all(user_id: sold_by.id, account_id: account.id)
      update_sold_by
    end
  end

  def active_install_types
    if install_types.present?
      project_type_keys = install_types.select { |type| type if send(type.to_s) }.keys
      project_type_keys.map { |item| item.titleize }.to_sentence
    else
      "No install types selected yet"
    end
  end

  Appointment.post_close_required_appointment_types.each do |appointment_type|
    define_method(:"#{appointment_type.gsub(/[- ]/, "_")}_needed?") { appointment_types_still_needed.include?(appointment_type) }
  end

  def appointment_types_still_needed
    Appointment.types_still_needed(self)
  end

  def self.ossrp_filled_projects
    FormResponse.respondables_with_filled_fields(self, "OSSRP")
  end

  def self.installer_filters_ids(project_stage)
    case project_stage
    when "rough_inspection_needed"
      need_rough_inspection_ids
    when "rough_inspection_pending"
      rough_in_inspection_pending_ids
    when "paneling_install_needed"
      paneling_install_needed_ids
    when "final_inspection_needed"
      final_inspection_needed_ids
    when "final_inspection_pending"
      final_inspection_pending_ids
    end
  end

  def self.paneling_install_completed_ids
    Appointment.active.paneling_installs.completed.map(&:project_id)
  end

  def self.paneling_install_pending_ids
    Appointment.active.paneling_installs.unsettled.map(&:project_id)
  end

  def self.rough_in_inspection_completed_ids
    Appointment.active.rough_in_inspections.completed.map(&:project_id)
  end

  def self.rough_in_inspection_failed_ids
    Appointment.active.rough_in_inspections.failed.map(&:project_id)
  end

  def self.rough_in_inspection_pending_ids
    Appointment.active.rough_in_inspections.unsettled.map(&:project_id)
  end

  def self.final_inspection_pending_ids
    Appointment.active.final_inspections.map(&:project_id)
  end

  def self.racking_install_completed_ids
    Appointment.active.racking_installs.completed.map(&:project_id)
  end

  def self.rough_in_inspection_ids
    Appointment.active.rough_in_inspections.map(&:project_id)
  end

  def self.need_rough_inspection_ids
    (racking_install_completed_ids - rough_in_inspection_completed_ids - rough_in_inspection_pending_ids) +
      (rough_in_inspection_failed_ids - rough_in_inspection_completed_ids - rough_in_inspection_pending_ids)
  end

  def self.paneling_install_needed_ids
    (rough_in_inspection_completed_ids - paneling_install_pending_ids) - paneling_install_completed_ids
  end

  def self.final_inspection_needed_ids
    paneling_install_completed_ids - final_inspection_pending_ids
  end

  def calendar_details_array_count
    if solar_array_count.present?
      "Solar Array Count: #{solar_array_count}"
    else
    "Solar Array Count: Not Saved Yet"
    end
  end
end
