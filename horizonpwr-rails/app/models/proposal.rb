# == Schema Information
#
# Table name: proposals
#
#  id                           :bigint           not null, primary key
#  archived                     :boolean          default(FALSE), not null
#  aurora_design_completed_at   :datetime
#  aurora_design_requested_at   :datetime
#  aurora_project_source        :text
#  blocked                      :boolean          default(FALSE), not null
#  blocked_at                   :datetime
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
#  aurora_design_id             :text
#  aurora_project_id            :text
#  aurora_project_linked_by_id  :bigint
#  blocked_by_id                :bigint
#  design_by_id                 :bigint
#  project_id                   :bigint
#  quality_control_by_id        :bigint
#
# Indexes
#
#  index_proposals_on_address_id                   (address_id)
#  index_proposals_on_appointment_id               (appointment_id)
#  index_proposals_on_aurora_project_linked_by_id  (aurora_project_linked_by_id)
#  index_proposals_on_blocked_by_id                (blocked_by_id)
#  index_proposals_on_design_by_id                 (design_by_id)
#  index_proposals_on_project_id                   (project_id)
#  index_proposals_on_quality_control_by_id        (quality_control_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (appointment_id => appointments.id)
#  fk_rails_...  (aurora_project_linked_by_id => users.id)
#  fk_rails_...  (blocked_by_id => users.id)
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
  belongs_to :blocked_by, class_name: "User", foreign_key: "blocked_by_id", optional: true

  has_many_attached :attachments
  has_many :tags, through: :attachments_attachments
  has_many :contacts, through: :address
  has_one :scheduled_with, through: :appointment
  has_one :created_by, through: :appointment
  has_one :energy_consumption, dependent: :destroy

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:id, :blocked_on, :completion_state, :reason_incomplete, :blocked_at],
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

  def self.statuses
    ["new", "draw", "quality", "complete", "closed", "ready for close call", "pending aurora"]
  end

  def self.ordered_by_appointment_date(direction = "DESC")
    where(archived: false, completion_state: ["new", "draw", "quality", "complete", "closed", "ready for close call", "pending aurora"]).includes(:design_by, :quality_control_by, appointment: [:contacts, :scheduled_with, :created_by, :address]).order("appointments.start_at #{direction}")
  end

  def self.blocked_choices
    [
      "Appointment Cancelled",
      "Needs Usage",
      "Needs Photos",
      "Duplicate",
      "Wrong Address",
      "No Sit"
    ]
  end

  def self.steps
    ["Consumption", "Home Design", "Panel Layout", "Trees", "Pricing", "Financing", "Proposal Template", "Proposal Attached"]
  end

  def mark_ready_for_close
    update(completion_state: "ready for close call")
  end

  def aurora_design_summary
    AuroraClient.new.design_summary(aurora_design_id)
  end

  def aurora_list_designs
    AuroraClient.new.list_designs(aurora_project_id)["designs"]
  end

  def ready_for_close
    ["complete", "ready for close call"].include?(completion_state)
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
    when "ready for close call"
      "blue"
    when "closed"
      "gray"
    when "pending aurora"
      "purple"
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
    when "ready for close call"
      "Ready for Close Call"
    when "closed"
      "Closed"
    when "pending aurora"
      "Pending Aurora"
    end
  end

  def all_tags
    (sorted_tags.map(&:name) | required_tags | needed_tags | available_tags).uniq.sort
  end

  def sorted_tags
    tags.uniq.sort
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
end
