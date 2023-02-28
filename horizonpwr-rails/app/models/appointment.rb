# == Schema Information
#
# Table name: appointments
#
#  id                                :bigint           not null, primary key
#  appointment_status                :string           default("scheduled"), not null
#  appointment_status_reason         :string
#  appointment_subtype               :string
#  appointment_type                  :string           not null
#  archived                          :boolean          default(FALSE), not null
#  completed_at                      :datetime
#  end_at                            :datetime
#  failed                            :boolean
#  held                              :boolean
#  held_at                           :datetime
#  held_reason                       :string
#  source                            :string           default("pwrstation")
#  start_at                          :datetime
#  task_completion                   :jsonb            not null
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  account_id                        :bigint
#  address_id                        :bigint
#  canvass_appointment_id            :string
#  consult_id                        :bigint
#  created_by_id                     :bigint
#  created_by_position_id            :bigint
#  held_by_id                        :bigint
#  installer_account_id              :bigint
#  project_id                        :bigint
#  salesforce_opportunity_id         :string
#  salesforce_residential_project_id :string
#  scheduled_with_id                 :bigint
#
# Indexes
#
#  index_appointments_on_account_id                         (account_id)
#  index_appointments_on_address_id                         (address_id)
#  index_appointments_on_canvass_appointment_id             (canvass_appointment_id)
#  index_appointments_on_consult_id                         (consult_id)
#  index_appointments_on_created_by_id                      (created_by_id)
#  index_appointments_on_created_by_position_id             (created_by_position_id)
#  index_appointments_on_held_by_id                         (held_by_id)
#  index_appointments_on_installer_account_id               (installer_account_id)
#  index_appointments_on_project_id                         (project_id)
#  index_appointments_on_salesforce_opportunity_id          (salesforce_opportunity_id)
#  index_appointments_on_salesforce_residential_project_id  (salesforce_residential_project_id)
#  index_appointments_on_scheduled_with_id                  (scheduled_with_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (consult_id => appointments.id)
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (created_by_position_id => job_positions.id)
#  fk_rails_...  (held_by_id => users.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (scheduled_with_id => users.id)
#
class Appointment < ApplicationRecord
  # belongs_to :account_user, foreign_key: "created_by_id", optional: true
  # belongs_to :account_user, foreign_key: "scheduled_with_id", optional: true
  belongs_to :created_by, class_name: "User", foreign_key: "created_by_id", optional: true
  belongs_to :scheduled_with, class_name: "User", foreign_key: "scheduled_with_id", optional: true
  belongs_to :held_by, class_name: "User", foreign_key: "held_by_id", optional: true
  belongs_to :account
  belongs_to :created_by_position, class_name: "JobPosition", foreign_key: "created_by_position_id", optional: true
  belongs_to :address
  belongs_to :consult, class_name: "Appointment", optional: true
  belongs_to :project, optional: true

  has_many :contact_appointments, dependent: :destroy
  has_many :contacts, through: :address
  has_one :proposal
  has_many :appointments, class_name: "Appointment", foreign_key: "consult_id"
  has_many :notes, as: :notable, dependent: :nullify

  scope :completed, -> { where(appointment_status: "completed") }
  scope :scheduled, -> { where(appointment_status: "scheduled") }
  # pending is a rails method, using unsettled instead
  scope :unsettled, -> { where(appointment_status: pending_statuses) }
  scope :failed, -> { where(appointment_status: "failed") }

  scope :assists, -> { where(appointment_type: "site audit") }
  scope :leads, -> { where(appointment_type: "consult") }

  scope :quality_sits, -> { where(appointment_type: "consult", held: true) }
  scope :scheduled_installs, -> { where(["appointment_type LIKE ?", "%install"]) }
  scope :active, -> { where(archived: false) }
  scope :created_this_year, -> { where("created_at > ? AND created_at < ?", Date.today.beginning_of_year, Date.today.end_of_year) }
  scope :created_today, -> { where("created_at > ? AND created_at < ?", Date.today.beginning_of_day, Date.today.end_of_day) }
  scope :scheduled_today, -> { where("start_at > ? AND start_at < ?", Date.today.beginning_of_day, Date.today.end_of_day) }
  scope :scheduled_on_given_day, ->(date) {  where(:start_at => date.beginning_of_day..date.end_of_day) }

  accepts_nested_attributes_for :project

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

  before_save :end_at_default
  before_save :notify_if_install_date_changed
  before_save :set_installer_account_id
  before_save :set_default_task_completion
  after_save :set_consult_consult_id
  after_create :proposal_ready_for_close
  after_commit :create_quality_sit, on: :create
  after_commit :update_project_sold_by
  after_save :update_performance_stats

  validates_with AppointmentConsultValidator, on: :create
  validates_with AppointmentHeldValidator, on: :update

  def self.closes
    assists
  end

  def self.created_this_week
    created_on_given_week(current_week_number)
  end

  def self.scheduled_this_week
    scheduled_on_given_week(current_week_number)
  end

  def self.current_week_number
    Time.now.strftime("%U").to_i
  end

  def self.scheduled_installs_created_this_week
    Project.scheduled_install_consults_created_this_week
  end

  def self.scheduled_install_consults_created_on_given_week(week, account_id)
    Project.scheduled_install_consults_created_on_given_week(week, account_id)
  end

  def self.inspection_types
    ["rough-in inspection", "final inspection"]
  end

  def self.required_install_types
    preferred_install_type + ["paneling install"]
  end

  def self.install_types
    required_install_types + ["roof install"]
  end

  def self.types_still_needed(object)
    post_close_required_appointment_types - object.appointments.map(&:appointment_type)
  end

  def self.post_close_types
    install_types + inspection_types + ["service call"]
  end

  def self.pre_close_types
    ["consult", "follow up", "site audit"]
  end

  def self.preferred_install_type
    ["racking install"]
  end

  def self.service_call_types
    ["service call"]
  end

  def self.appointment_types
    pre_close_types + post_close_types
  end

  def self.post_close_required_appointment_types
    required_install_types + inspection_types
  end

  Appointment.appointment_types.each do |type|
    scope "#{type.gsub(/[- ]/, "_")}s", -> { where(appointment_type: type) }
    define_method(:"#{type.tr(" ", "_")}?") { appointment_type == type }
  end

  def start_at_utc
    # NOTE: Final inspections are all-day events, so we set the start time to midnight that morning.
    final_inspection? ? start_at.beginning_of_day.utc : start_at.utc
  end

  def end_at_utc
    # NOTE: Final inspections are all-day events, so we set the end time to midnight that night.
    final_inspection? ? (start_at + 1.day).beginning_of_day.utc : end_at.utc
  end

  def time_range_by_appointment_type
    if Appointment.inspection_types.include?(appointment_type)
      "All Day"
    else
      "#{local_time(start_at)} - #{local_time(end_at)}"
    end
  end

  def proposal_ready_for_close
    if site_audit?
      consult.proposal.mark_ready_for_close
    end
  end

  # Appointment.last.create_quality_sit
  def create_quality_sit
    # paid for the appointment, not for the address. Earnings should be associated to the appointment...
    ActiveRecord::Base.transaction do
      if JobPosition.name_like("Field Marketer").map(&:id).include?(created_by_position_id)
        if appointment_type == "consult"
          earning = Earning.find_or_initialize_by(appointment: self, user: created_by)
          if held_previously_changed?(from: nil, to: true)
            # NOTE: This is assuming that you can only ever create an appointment in canvass with held as nil AND
            # that pwrstation receives and creates the appointment before a rep is able to mark it as held or not held
            earning.status = "accrued"
          elsif held_previously_changed?(from: true, to: false)
            earning.status = "lost"
          elsif held_previously_changed?(from: false, to: true)
            earning.status = "accrued"
          end
          earning.save!
        elsif created_by.nil? || created_by_position_id.nil?
          Honeybadger.context({appointment: self})
          Honeybadger.notify("create_quality_sit failed")
        end

        if created_by.tenure_in_weeks < 3
          earning_type = EarningType.find_by(name: "rampup_bonus_#{created_by.tenure_in_weeks}")
          Earning.joins(:payout_rate_variant).where(
            "payout_rate_variants.earning_type_id = ?
          AND earnings.address_id = ?
          AND earnings.user_id = ?",
            earning_type.id,
            address_id,
            created_by
          )&.first ||
            Earning.create!(appointment: self, user: created_by, earning_type: earning_type)
        end
      end
    end
  end

  # Business Logic
  # only have 1 quality sit per appointment,
  # FM can only earn 1 quality sit per address
  # create a quality sit, and an adjustment removing the earned amount with the reason of
  # "previously paid for this address"

  # User.active.each do |user|
  #   user.appointments.each do |appointment|
  #     appointment.create_quality_sit
  #   end
  # end

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
      AccountUser.account_default_manager(account)
  end

  def scheduled_with_name
    scheduled_with_consultant&.name
  end

  def quality_sit
    false
  end

  def inspection?
    Appointment.inspection_types.include?(appointment_type)
  end

  def install?
    Appointment.install_types.include?(appointment_type)
  end

  def post_install?
    Appointment.post_close_types.include?(appointment_type)
  end

  def pre_install?
    Appointment.pre_close_types.include?(appointment_type)
  end

  def service_call?
    Appointment.service_call_types.include?(appointment_type)
  end

  def self.appointment_subtypes
    [
      "building",
      "electrical"
    ]
  end

  def selector_types
    Appointment.post_close_types.include?(appointment_type) ? Appointment.post_close_types : Appointment.appointment_types
  end

  def self.appointment_types_by_job_position(job_position)
    case job_position
    when "Solar Install Technician"
      Appointment.post_close_types
    else
      appointment_types
    end
  end

  def feed_summary
    case appointment_type
    when "service call"
      "#{Contact.display_address_contacts(address, "last_name")} - #{appointment_type}#{address.display_city}"
    when "racking install", "paneling install", "final inspection", "rough-in inspection"
      "#{project.display_system_size}/kWh - #{Contact.display_address_contacts(address, "name")} - #{appointment_type}#{display_subtype}#{address.display_city}"
    when "consult", "site audit", "follow up"
      "#{Contact.display_address_contacts(address, "last_name")} - #{address.address}"
      # when "roof install"
      #   Placeholder, as we are unsure what will be required, but it is not needed at this time.
    end
  end

  def display_subtype
    # TODO: Concerned about data integrity. This is sometimes missing, as it is a new field.
    appointment_subtype.present? ? " - #{appointment_subtype.to_s.humanize}" : ""
  end

  def feed_formatted_contacts
    contacts = []
    address.contacts.each do |contact|
      contacts << "#{contact.name}: #{contact.phone}"
    end

    contacts.join(", ")
  end

  def description
    "#{appointment_type} - #{appointment_status}\n#{feed_formatted_contacts}"
  end

  def self.appointment_type_text_colors
    {
      "racking install": "text-green-600",
      "paneling install": "text-green-600",
      "ground install": "text-green-600",
      consult: "text-gray-600",
      "roof install": "text-blue-600",
      "site audit": "text-purple-600",
      inspection: "text-red-600",
      "rough-in inspection": "text-red-600",
      "final inspection": "text-red-600",
      "service call": "text-yellow-500"
    }
  end

  def self.appointment_subtype_text_colors
    {
      building: "text-green-600",
      electrical: "text-gray-600"
    }
  end

  def self.appointment_type_bg_colors
    {
      "racking install": "green",
      "paneling install": "green",
      "ground install": "green",
      consult: "gray",
      "roof install": "blue",
      "site audit": "purple",
      "final inspection": "red",
      "rough-in inspection": "red",
      inspection: "red",
      "service call": "yellow"
    }
  end

  def next_appointment_type
    case appointment_type
    when nil
      "consult"
    when "consult"
      "site audit"
    when "site audit"
      "paneling install"
    when "install", "ground install", "paneling install"
      "inspection"
    when "inspection"
      "service call"
    when "service call"
      "service call"
    end
  end

  def self.statuses
    pending_statuses +
      [
        "canceled",
        "no show",
        "completed",
        "failed"
      ]
  end

  def self.pending_statuses
    [
      "scheduled",
      "rescheduled",
      "needs rescheduled"
    ]
  end

  def status_color
    case appointment_status
    when "scheduled"
      "green"
    when "rescheduled"
      "green"
    when "needs rescheduled"
      "yellow"
    when "canceled", "blocked", "failed"
      "red"
    when "no show"
      "indigo"
    when "completed"
      "blue"
    end
  end

  def local_appointment_time
    set_time_zone_params(scheduled_with_consultant.time_zone)
    date_with_offset = start_at - @offset
    date_with_offset.strftime("%b %e, %Y, %l:%M %P (#{@tz_abbr})")
  end

  def find_missing_created_by
    json = CanvassClient.new.find_appointment(canvass_appointment_id)
    user = User.find_by(canvass_user_id: json["employee_id"]) if json.present?
    update_attribute(created_by: user) if user.present?
  end

  def create_appointment_redirect_to
    project.present? ? project : consult.proposal
  end

  def self.not_held_reasons
    [
      ["Sold", "Sold"],
      ["Not Home", "Not Home"],
      ["Go Back", "Go Back"],
      ["Not Ready Yet (Keep Knocking)", "Not Ready Yet (Keep Knocking)"],
      ["No Show (Needs Rescheduled)", "No Show (Needs Rescheduled)"],
      ["Rescheduled", "Rescheduled"],
      ["Commercial Lead", "Commercial Lead"],
      ["Renter", "Renter"],
      ["Competitor", "Competitor"],
      ["Failed Credit", "Failed Credit"],

      ["Sit Not Sold - Avoiding Debt", "Sit Not Sold - Avoiding Debt"],

      ["Sit Not Sold - Closed Minded", "Sit Not Sold - Closed Minded"],
      ["Sit Not Sold - Currently Refinancing", "Sit Not Sold - Currently Refinancing"],
      ["Sit Not Sold - No ROI", "Sit Not Sold - No ROI"],
      ["Sit Not Sold - Not Full Offset", "Sit Not Sold - Not Full Offset"],
      ["Sit Not Sold - Plan on Reducing Consumption", "Sit Not Sold - Plan on Reducing Consumption"],
      ["Sit Not Sold - Refused to Run Credit", "Sit Not Sold - Refused to Run Credit"],
      ["Sit Not Sold - Sleep on It", "Sit Not Sold - Sleep on It"],
      ["Sit Not Sold - Talk to CPA", "Sit Not Sold - Talk to CPA"],
      ["Sit Not Sold - Talk To Realtor", "Sit Not Sold - Talk To Realtor"],
      ["Sit Not Sold - Tax Credit", "Sit Not Sold - Tax Credit"],
      ["Sit Not Sold - Won't Pay 99", "Sit Not Sold - Won't Pay 99"],
      ["Sit Not Sold - One Legger", "Sit Not Sold - One Legger"],
      ["Sit Not Sold - Moving (less than 2 yrs)", "Sit Not Sold - Moving (less than 2 yrs)"],
      ["Sit Not Sold - 70 plus (age)", "Sit Not Sold - 70 plus (age)"],
      ["Sit Not Sold - Loan Payment Higher Than Bill", "Sit Not Sold - Loan Payment Higher Than Bill"],
      ["Sit Not Sold - Aesthetics", "Sit Not Sold - Aesthetics"]
    ]
  end

  def calendar_title
    if appointment_type.include? "consult"
      proposal
    elsif appointment_type.include? "follow"
      consult.proposal
    else
      project
    end
  end

  def self.created_on_given_week(week_number)
    where("created_at > ? AND created_at < ?", (Date.commercial(Date.current.year, week_number, 1) - 1), (Date.commercial(Date.current.year, week_number, 7) + 1))
  end

  def self.scheduled_on_given_week(week_number)
    where("start_at  > ? AND start_at < ?", (Date.commercial(Date.current.year, week_number, 1) - 1), (Date.commercial(Date.current.year, week_number, 7) + 1))
  end

  def find_installer_account_id
    installer_account_id ||= set_installer_account_id
  end

  def set_failed
    appointment_status = "failed"
    failed = true
  end

  def self.account_leads(account, week)
    active.created_on_given_week(week.to_i).where(account_id: account.id).leads.distinct(:address_id)
  end

  def self.account_quality_sits(account, week)
    active.scheduled_on_given_week(week.to_i).where(account_id: account.id).quality_sits.distinct(:address_id)
  end

  def self.account_scheduled_installs(account, week)
    scheduled_install_consults_created_on_given_week(week.to_i, account.id.to_i)
  end

  private

  def set_installer_account_id
    if Appointment.post_close_types.include?(appointment_type) && !project_id.nil? && !project.installer_id.nil?
      self.installer_account_id = project.installer.accounts.first.id
    end
  end

  def set_time_zone_params(time_zone)
    case time_zone
    when "Pacific Time (US & Canada)"
      @offset = 28800
      @tz_abbr = "PST"
    when "Mountain Time (US & Canada)"
      @offset = 25200
      @tz_abbr = "MST"
    when "Central Time (US & Canada)"
      @offset = 21600
      @tz_abbr = "CST"
    when "Eastern Time (US & Canada)"
      @offset = 18000
      @tz_abbr = "EST"
    end
  end

  # NOTE: This must be a before_action so it can tell if the field has changed.
  def notify_if_install_date_changed
    if persisted? && install? && will_save_change_to_start_at?
      changes = changes_to_save
      # TODO: Refactor to find out if we are assuming the timezone is a factor
      @old_start_at = set_datetime_in_zone(changes[:start_at][0])
      @new_start_at = set_datetime_in_zone(changes[:start_at][1])

      users_to_notify = User.where(id: [639, 293, 277]) # Trent, Judd, Collin

      # Trigger notification, and pass in the above variables.
      InstallDateChangeNotification.with(old_start_at: @old_start_at, new_start_at: @new_start_at, appointment: id).deliver_later(users_to_notify)
    end
  end

  def set_datetime_in_zone(datetime)
    if scheduled_with.present?
      datetime.in_time_zone(scheduled_with.time_zone).strftime("%A, %b. %e, %l:%M %p")
    else
      datetime.in_time_zone(created_by.time_zone).strftime("%A, %b. %e, %l:%M %p")
    end
  end

  def set_consult_consult_id
    self.consult = self if consult?
  end

  def update_project_sold_by
    project.update_sold_by if consult? && project.present?
  end

  def end_at_default
    self.end_at ||= (start_at + 1.hour)
  end

  def set_default_task_completion
    if appointment_type == "racking install" && appointment_status != "completed"
      task_completion["racking"] ||= false
      task_completion["electrical"] ||= false
      set_completed_at if task_completion.values.uniq == [true]
    elsif appointment_type == "paneling install" && appointment_status != "completed"
      task_completion["paneling"] ||= false
      task_completion["commissioning"] ||= false
      set_completed_at if task_completion.values.uniq == [true]
    end
  end

  def set_completed_at
    self.completed_at = Time.now
    self.appointment_status = "completed"
    InstallCompletionNotification.with(appointment_id: id).deliver_later(User.project_managers)
  end

  def update_performance_stats
    if account.present? && (consult? || racking_install?)
      PerformanceStat.update_this_week_performance_stats(account)
    end
  end
end
