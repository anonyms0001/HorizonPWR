# == Schema Information
#
# Table name: projects
#
#  id                                :bigint           not null, primary key
#  battery                           :boolean
#  energy_efficiency_pack            :boolean
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  address_id                        :bigint
#  finance_partner_id                :bigint
#  installer_id                      :bigint
#  salesforce_opportunity_id         :string
#  salesforce_residential_project_id :string
#
# Indexes
#
#  index_projects_on_address_id          (address_id)
#  index_projects_on_finance_partner_id  (finance_partner_id)
#  index_projects_on_installer_id        (installer_id)
#
# Foreign Keys
#
#  fk_rails_...  (finance_partner_id => finance_partners.id)
#  fk_rails_...  (installer_id => installers.id)
#
class Project < ApplicationRecord
  belongs_to :installer, optional: true
  belongs_to :finance_partner, optional: true
  belongs_to :address, optional: true
  belongs_to :account, optional: true

  has_many :contact_addresses
  has_many :contacts, through: :address
  has_many_attached :attachments
  has_many :tags, through: :attachments_attachments

  has_many :appointments, dependent: :destroy
  has_many :proposals
  has_many :project_feeds, dependent: :destroy
  has_many :notes, as: :notable

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

  def name
    address&.contacts&.first&.name || "Unknown"
  end

  def sorted_tags
    tags.uniq.sort
  end

  def all_tags
    (sorted_tags.map(&:name) | required_tags | needed_tags | available_tags).uniq.sort
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
    ]).uniq.sort
  end

  # These are the tags that we indicate are missing on a project show page
  def missing_tags
    (needed_tags - tags.map(&:name).uniq).sort
  end

  def status
    # Appointment.find(project_id: self.id, appointment_type: 'install').appointment_status
    pending_install = Appointment.where(project_id: id, appointment_type: "install")&.first
    unless pending_install.present?
      return Appointment.where(project_id: id)&.last&.appointment_type
    end
    pending_install&.appointment_status
  end

  def finance_partner_selector
    finance_partner || FinancePartner.find_by(name: "Generations")
  end
end
