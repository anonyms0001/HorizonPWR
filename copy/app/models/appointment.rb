# == Schema Information
#
# Table name: appointments
#
#  id                                :bigint           not null, primary key
#  appointment_status                :string           default("scheduled"), not null
#  appointment_status_reason         :string
#  appointment_type                  :string           not null
#  date                              :datetime
#  source                            :string           default("pwrstation")
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  account_id                        :bigint
#  address_id                        :bigint
#  canvass_appointment_id            :string
#  created_by_id                     :bigint
#  created_by_position_id            :bigint
#  project_id                        :bigint
#  salesforce_opportunity_id         :string
#  salesforce_residential_project_id :string
#  scheduled_with_id                 :bigint
#
# Indexes
#
#  index_appointments_on_account_id              (account_id)
#  index_appointments_on_address_id              (address_id)
#  index_appointments_on_created_by_id           (created_by_id)
#  index_appointments_on_created_by_position_id  (created_by_position_id)
#  index_appointments_on_project_id              (project_id)
#  index_appointments_on_scheduled_with_id       (scheduled_with_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (created_by_position_id => job_positions.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (scheduled_with_id => users.id)
#
class Appointment < ApplicationRecord
  # belongs_to :account_user, foreign_key: "created_by_id", optional: true
  # belongs_to :account_user, foreign_key: "scheduled_with_id", optional: true
  belongs_to :created_by, class_name: "User", foreign_key: "created_by_id", optional: true
  belongs_to :scheduled_with, class_name: "User", foreign_key: "scheduled_with_id", optional: true
  belongs_to :account
  belongs_to :job_position, foreign_key: "created_by_position_id", optional: true
  belongs_to :address
  belongs_to :project, optional: true

  has_many :contact_appointments, dependent: :destroy
  has_many :contacts, through: :address
  has_many :proposals, through: :address

  attr_accessor :consult_appointment_id

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:id, :account_id, :appointment_status, :appointment_type],
    associated_against: {
      address: [:address, :address_type, :city, :number, :postal_code, :state, :street],
      contacts: [:first_name, :last_name, :email, :phone],
      created_by: [:first_name, :last_name, :email, :phone],
      scheduled_with: [:first_name, :last_name, :email, :phone],
      account: [:name]
    },
    using: {tsearch: {prefix: true}}

  def name
    address&.contacts&.first&.name || "Unknown"
  end

  def created_by_name
    created_by&.name || "unknown"
  end

  def created_by_team
    account&.name || "unknown"
  end

  def scheduled_with_consultant
    scheduled_with ||
      AccountUser.find_by(account: account, user: created_by)&.default_energy_consultant ||
      account.account_default_manager
  end

  def scheduled_with_name
    scheduled_with_consultant&.name
  end

  def quality_sit
    false
  end

  def statuses
    ["scheduled",
      "rescheduled",
      "needs rescheduled",
      "canceled",
      "no show",
      "completed"]
  end

  def status_color
    case appointment_status
    when "scheduled"
      "green"
    when "rescheduled"
      "green"
    when "needs rescheduled"
      "yellow"
    when "canceled"
      "red"
    when "no show"
      "indigo"
    when "completed"
      "blue"
    end
  end
end
