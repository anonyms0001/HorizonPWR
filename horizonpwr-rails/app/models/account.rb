# == Schema Information
#
# Table name: accounts
#
#  id                        :bigint           not null, primary key
#  active                    :boolean          default(FALSE)
#  card_exp_month            :string
#  card_exp_year             :string
#  card_last4                :string
#  card_type                 :string
#  domain                    :string
#  extra_billing_info        :text
#  historic_canvass_team_ids :text             default([]), is an Array
#  name                      :string           not null
#  personal                  :boolean          default(FALSE)
#  processor                 :string
#  subdomain                 :string
#  trial_ends_at             :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  canvass_team_id           :string
#  installer_id              :bigint
#  owner_id                  :bigint
#  processor_id              :string
#
# Indexes
#
#  index_accounts_on_installer_id  (installer_id)
#  index_accounts_on_owner_id      (owner_id)
#
# Foreign Keys
#
#  fk_rails_...  (installer_id => installers.id)
#  fk_rails_...  (owner_id => users.id)
#

class Account < ApplicationRecord
  include Pay::Billable

  RESERVED_DOMAINS = [Jumpstart.config.domain]
  RESERVED_SUBDOMAINS = %w[app help support]

  belongs_to :owner, class_name: "User"
  belongs_to :installer, optional: true

  has_many :account_invitations, dependent: :destroy
  has_many :account_users, dependent: :destroy
  has_many :appointments, through: :users
  has_many :notifications, dependent: :destroy
  has_many :users, through: :account_users
  has_many :performance_stats, as: :accountable

  scope :personal, -> { where(personal: true) }
  scope :impersonal, -> { where(personal: false) }
  scope :sorted, -> { order(personal: :desc, name: :asc) }

  has_noticed_notifications
  has_one_attached :avatar

  validates :name, presence: true
  validates :domain, exclusion: {in: RESERVED_DOMAINS, message: :reserved}
  validates :subdomain, exclusion: {in: RESERVED_SUBDOMAINS, message: :reserved}, format: {with: /\A[a-zA-Z0-9]+[a-zA-Z0-9\-_]*[a-zA-Z0-9]+\Z/, message: :format, allow_blank: true}

  def email
    # TODO: Violates Single Responsibility Principle Section 2.2 & Law of Demeter
    # Any improvements need to be submitted to Jumpstart Pro
    account_users.includes(:user).order(created_at: :asc).first.user.email
  end

  def impersonal?
    !personal?
  end

  def personal_account_for?(user)
    personal? && owner_id == user.id
  end

  def self.active_sales_accounts
    impersonal.where(active: true, installer_id: nil)
  end

  def self.installers
    where.not(installer_id: nil)
  end

  def closers
    users.map { |i| i if i.closer? }.reject(&:blank?)
  end

  def members_type_select(member_type)
    job_ids = JobPosition.send("#{member_type}_positions_select").map(&:id)
    account_users.with_active_user.select{ |account_user| job_ids.include? account_user.user.job_position_id }
  end

  def field_marketer_select
    user_select("Marketer")
  end

  def energy_consultant_select
    user_select("Energy Consultant")
  end

  def user_select(job_position)
    job_ids = JobPosition.where("name like ? OR name like ?", "%#{job_position}%", "%Manager%").map(&:id)
    users.where(active: true).where(job_position_id: job_ids).order(first_name: :asc)
  end

  # AccountUser.find_by(account: account)
  # AccountUser.default_managers
  def owner?(user)
    owner_id == user.id
  end

  # An account can be transferred by the owner if it:
  # * Isn't a personal account
  # * Has more than one user in it
  def can_transfer?(user)
    impersonal? && owner?(user) && users.size >= 2
  end

  def calculate_number_of_times_won_in_year
    # wins = 0
    # weeks = current_week_number
    # while weeks > 0
    #   wins += 1 if Account.week_winner(weeks) == self
    #   weeks -= 1
    # end
    # wins
    1.upto(current_week_number).sum do |week_number|
      Account.week_winner(weeks) == self ? 1 : 0
    end
  end

  # Transfers ownership of the account to a user
  # The new owner is automatically granted admin access to allow editing of the account
  # Previous owner roles are unchanged
  def transfer_ownership(user_id)
    previous_owner = owner
    account_user = account_users.find_by!(user_id: user_id)
    user = account_user.user

    ApplicationRecord.transaction do
      account_user.update!(admin: true)
      update!(owner: user)

      # Add any additional logic for updating records here
    end

    # Notify the new owner of the change
    Account::OwnershipNotification.with(account: self, previous_owner: previous_owner.name).deliver_later(user)
  rescue
    false
  end

  def leads(week)
    Appointment.account_leads(self, week)
  end

  def quality_sits(week)
    Appointment.account_quality_sits(self, week)
  end

  def scheduled_installs(week)
    Appointment.account_scheduled_installs(self, week)
  end

  def dynamic_team_week_score(week)
    week_score(week)
  end

  def week_score(week)
    leads(week).size +
      quality_sits(week).size * 2 +
      scheduled_installs(week).size * 25
  end

  def leaderboard_scores(team_count, current_week)
    if team_count.to_i > 0
      "#{team_count.to_i}W-#{current_week.to_i - team_count.to_i}L"
    else
      "0W-#{current_week.to_i}L"
    end
  end

  def leaderboard_win_loss(datetime)
    PerformanceStat.win_loss_count(self, datetime)
  end

  def week_lead_count(datetime)
    leads(datetime.strftime("%U").to_i).size
  end

  def week_quality_sit_count(datetime)
    quality_sits(datetime.strftime("%U").to_i).size
  end

  def week_scheduled_install_count(datetime)
    scheduled_installs(datetime.strftime("%U").to_i).size
  end

  def current_week_number
    Time.current.strftime("%U").to_i
  end

  def self.week_winner(week)
    active_sales_accounts.max_by { |team| team.week_score(week) }
  end

  def self.this_week_winner
    week_winner(current_week_number)
  end

  def this_week_created_appointments
    Appointment.created_this_week.where(account_id: id)
  end

  def this_week_scheduled_appointments
    Appointment.scheduled_this_week.where(account_id: id)
  end

  def this_week_scheduled_installs
    Project.scheduled_install_consults_created_this_week.where(account_id: id)
  end

  def this_week_leads_count
    leads(current_week_number).size
  end

  def this_week_quality_sits_count
    quality_sits(current_week_number).size
  end

  def this_week_scheduled_installs_count
    scheduled_installs(current_week_number).size
  end

  def this_week_points
    this_week_leads_count +
      (this_week_quality_sits_count * 2) +
      (this_week_scheduled_installs_count * 25)
  end

  def this_week_stats
    @this_week_stats ||= PerformanceStat.week_stats(self, Time.current)
  end

  def week_stats(date)
    @week_stats ||= PerformanceStat.week_stats(self, date)
  end

  def year_stats(date)
    @year_stats ||= PerformanceStat.year_stats(self, date)
  end

  def this_year_stats
    @this_year_stats ||= PerformanceStat.year_accountable_stats(self, Time.current)
  end

  def stats(time_period: "week", datetime: Time.current)
    case time_period
    when "week"
      week_stats(datetime)
    when "year"
      year_stats(datetime)
    when "month"
      week_stats(datetime)
    end
  end

  def owns_note?(note)
    installer_id == if note.notable_type == "Appointment"
      # NOTE: An Appointment may have an installer_account_id, but it may inherit its Installer from its Project.
      #       This method will find whichever exists.
      note.notable.find_installer_account_id
    else
      note.notable.installer_id
    end
  end

  # NOTE: Types of Accounts/Teams: Sales, Solar Installer, Support (Don't have teams in the system yet.), Roof Installers (Not in the system yet.)
  def self.sales_accounts
    impersonal.active.where(installer_id: nil)
  end

  def self.solar_installer_accounts
    impersonal.active.where.not(installer_id: nil)
  end

  def self.sales_account_options_for_select
    [
      "Sales Teams",
      sales_accounts.map { |a| [a.name, a.id] }.sort
    ]
  end

  def installer?
    installer_id.present?
  end

  def self.solar_installer_account_options_for_select
    [
      "Solar Install Teams",
      solar_installer_accounts.map { |a| [a.name, a.id] }.sort
    ]
  end

  def self.no_account
    # ie, Account.none
    [
      "None",
      [["No Team", ""]]
    ]
  end

  def self.options_for_select
    array = []
    array << no_account
    array << sales_account_options_for_select
    array << solar_installer_account_options_for_select
    array
  end

  # Uncomment this to add generic trials (without a card or plan)
  #
  # before_create do
  #   self.trial_ends_at = 14.days.from_now
  # end

  # If you need to create some associated records when an Account is created,
  # use a `with_tenant` block to change the current tenant temporarily
  #
  # after_create do
  #   ActsAsTenant.with_tenant(self) do
  #     association.create(name: "example")
  #   end
  # end
end
