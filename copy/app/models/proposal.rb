# == Schema Information
#
# Table name: proposals
#
#  id                           :bigint           not null, primary key
#  blocked                      :boolean          default(FALSE), not null
#  blocked_on                   :string
#  completion_state             :string           default("new"), not null
#  design_completed_at          :datetime
#  design_started_at            :datetime
#  quality_control_completed_at :datetime
#  quality_control_section_step :integer          default(1)
#  quality_control_started_at   :datetime
#  quality_control_step         :integer          default(1)
#  reason_incomplete            :string
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  address_id                   :bigint
#  appointment_id               :bigint
#  design_by_id                 :bigint
#  project_id                   :bigint
#  quality_control_by_id        :bigint
#
# Indexes
#
#  index_proposals_on_address_id             (address_id)
#  index_proposals_on_appointment_id         (appointment_id)
#  index_proposals_on_design_by_id           (design_by_id)
#  index_proposals_on_project_id             (project_id)
#  index_proposals_on_quality_control_by_id  (quality_control_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (appointment_id => appointments.id)
#  fk_rails_...  (design_by_id => users.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (quality_control_by_id => users.id)
#
class Proposal < ApplicationRecord
  belongs_to :appointment
  belongs_to :address
  belongs_to :project, optional: true
  belongs_to :quality_control_by, class_name: "User", foreign_key: "quality_control_by_id", optional: true
  belongs_to :design_by, class_name: "User", foreign_key: "design_by_id", optional: true

  has_many_attached :attachments
  has_many :contacts, through: :address
  has_one :scheduled_with, through: :appointment
  has_one :created_by, through: :appointment

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:id, :blocked_on, :completion_state, :reason_incomplete],
    associated_against: {
      address: [:address, :address_type, :city, :number, :postal_code, :state, :street],
      contacts: [:first_name, :last_name, :email, :phone],
      created_by: [:first_name, :last_name, :email, :phone],
      design_by: [:first_name, :last_name, :email, :phone],
      quality_control_by: [:first_name, :last_name, :email, :phone],
      scheduled_with: [:first_name, :last_name, :email, :phone]
    },
    using: {tsearch: {prefix: true}}

  def design_by_name
    design_by&.name || "N/A"
  end

  def quality_control_by_name
    quality_control_by&.name || "N/A"
  end

  def name
    appointment&.address&.contacts&.first&.name || "Unknown"
  end

  def self.ordered_by_appointment_date
    where(completion_state: ["new", "draw", "quality", "complete", "closed", "ready for close"]).includes(:design_by, :quality_control_by, appointment: [:contacts, :scheduled_with, :created_by, :address]).order("appointments.date ASC")
  end

  def self.blocked_choices
    [
      "Needs Usage",
      "Needs Photos",
      "Tree Trimming",
      "Wrong Address"
    ]
  end

  def self.steps
    ["Consumption", "Home Design", "Panel Layout", "Trees", "Pricing", "Financing", "Proposal Template", "Proposal Attached"]
  end

  # def quality_check_percent
  #   Get Required FieldConfig IDs:
  #     @required_field_configs = @form.form_configs.map{|x| x.field_configs.where(required: true)}.flatten&.reject(&:blank?)
  #   Get Total:
  #     @required_field_configs.count
  #   Get Completed FieldResponses:
  #     @field_responses = FieldResponse.where(field_config_id: @required_field_configs)
  #     Then, check if they have been completed:
  #     @field_responses.map{|fr| fr.completed?}.count
  #   Progress == completed / total
  #     (@field_responses.map{|fr| fr.completed?}.count) / (@required_field_configs.count)
  # end

  def self.mine(current_user)
    where("design_by_id = ? OR quality_control_by_id = ?", current_user.id, current_user.id)
  end

  def time_til_start_design
    "#{((created_at - (design_started_at || Time.now)) / 60).round} minutes"
  end

  def time_design_completed
    if design_started_at.present? && design_completed_at.present?
      "#{((design_completed_at - design_started_at) / 60).round} minutes"
    elsif design_started_at.present? && !design_completed_at.present?
      "Started"
    else
      "Not Started"
    end
  end

  def time_quality_control_completed
    if quality_control_started_at.present? && quality_control_completed_at.present?
      "#{((quality_control_completed_at - quality_control_started_at) / 60).round} minutes"
    elsif quality_control_started_at.present? && !quality_control_completed_at.present?
      "Started"
    else
      "Not Started"
    end
  end

  def state_color
    case completion_state
    when "new"
      "green"
    when "draw"
      "yellow"
    when "quality"
      "indigo"
    when "complete"
      "blue"
    when "blocked"
      "red"
    when "ready for close"
      "blue"
    when "closed"
      "gray"
    end
  end

  def state_label
    case completion_state
    when "new"
      "New"
    when "draw"
      "Drawing"
    when "quality"
      "Quality"
    when "complete"
      "Complete"
    when "blocked"
      "Blocked"
    when "ready for close"
      "Ready for Close"
    when "closed"
      "Closed"
    end
  end
end
