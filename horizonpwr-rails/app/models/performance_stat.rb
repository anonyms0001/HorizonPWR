# == Schema Information
#
# Table name: performance_stats
#
#  id               :bigint           not null, primary key
#  accountable_type :string           not null
#  end_at           :datetime         not null
#  kpi              :jsonb            not null
#  kpi_type         :string
#  position         :integer
#  start_at         :datetime         not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  accountable_id   :bigint           not null
#
# Indexes
#
#  index_performance_stats_on_accountable  (accountable_type,accountable_id)
#
class PerformanceStat < ApplicationRecord
  belongs_to :accountable, polymorphic: true

  before_save :set_kpi_values
  after_save :verify_position_number

  scope :earned, -> { where.not("start_at >= ? AND end_at <= ?", Time.current.beginning_of_week, Time.current.end_of_week) }
  scope :wins, -> { where(position: 1) }
  scope :accountable_stats, ->(accountable) { where(accountable: accountable) }
  scope :up_to, ->(date) { where("start_at >= ? AND end_at <= ?", date.getutc.beginning_of_year, date) }
  scope :year, ->(date) { where("start_at >= ? AND end_at <= ?", date.getutc.beginning_of_year, date.getutc.end_of_year) }
  scope :month, ->(date) { where("start_at >= ? AND end_at <= ?", date.getutc.beginning_of_month, date.getutc.end_of_month) }
  scope :quarter, ->(date) { where("start_at >= ? AND end_at <= ?", date.getutc.beginning_of_quarter, date.getutc.end_of_quarter) }
  scope :week, ->(date) { where("start_at >= ? AND end_at <= ?", date.getutc.beginning_of_week, date.getutc.end_of_week) }
  scope :installer_stats, -> { where(kpi_type: 'installers')}
  scope :sales_stats, -> { where(kpi_type: 'sales')}

  KPIS = [:lead_count, :quality_sit_count, :scheduled_install_count, :score, :kWh, :inspection_pass_fail_rate, :inspection_pass_count, :inspection_fail_count, :overall].freeze

  KPIS.each do |value|
    define_method(:"#{value}") { kpi[value.to_s] }
  end

  def self.update_this_week_performance_stats(object)
    # TODO: updating from each to find_each instead
    # it was recommended  so it will perform this in batches of 1,000 as a default
    # thinking this have an application for other recurrences of each
    week(Time.current).where(accountable: object).find_each do |performance_stat|
      performance_stat.set_kpi_values
      performance_stat.save if performance_stat.changed?
    end
  end

  def self.year_stats(accountable, datetime)
    PerformanceStat.accountable_stats(accountable).year(datetime)
  end

  def self.time_period_stats(accountable, datetime, time_period)
    # hotfix: Not an example of good code
    stats = accountable_stats(accountable).send(time_period, datetime)
    return find_or_create_time_period_stats(accountable, datetime, time_period) if stats.empty?
    return stats
  end

  def self.find_or_create_time_period_stats(accountable, datetime, time_period)
    find_or_create_week_stat(accountable, datetime)
    PerformanceStat.accountable_stats(accountable).send(time_period, datetime)
  end

  def self.week_stats(accountable, date)
    datetime = default_end_at(date)
    find_or_create_week_stat(accountable, datetime)
  end

  def self.find_or_create_week_stat(accountable, datetime)
    PerformanceStat.accountable_stats(accountable).week(datetime).first ||
      create_week_stats(accountable, datetime)
  end

  def self.create_week_stats(accountable, datetime)
    find_or_create_by(start_at: datetime.getutc.beginning_of_week, end_at: datetime.getutc.end_of_week, accountable: accountable)
  end

  def self.win_loss_count(accountable, datetime)
    datetime = default_end_at(datetime)
    num_win = PerformanceStat.accountable_stats(accountable).wins.earned.up_to(datetime).size
    num_loss = (datetime.strftime("%U").to_i - 1) - num_win
    "#{num_win}W-#{num_loss}L"
  end

  def self.group_stats_by(accountable_type, time_period)
    group_by(&:accountable).each do |grouped_stats|
      grouped_stats
    end
  end

  def self.time_period_options
    %w[week month quarter year]
  end

  def self.format_datetime(date)
    # date.to_datetime.getutc
    date.to_datetime.end_of_day.getutc
  end

  def self.default_end_at(end_at)
    format_datetime(end_at ||= Time.current)
  end

  def self.default_time_period(time_period)
    time_period || "week"
  end

  def self.week_accountable_stats(accountable, datetime)
    week_kpi_outputs = PerformanceStat.week_stats(accountable, datetime).map { |performance_stat| performance_stat.kpi }

    sum = Hash.new(0)
    week_kpi_outputs.each_with_object(sum) do |hash, sum|
      hash.each { |key, value| sum[key] += value }
    end
  end

  def self.year_accountable_stats(accountable, datetime)
    year_kpi_outputs = PerformanceStat.year_stats(accountable, datetime).map { |performance_stat| performance_stat.kpi }

    sum = Hash.new(0)
    year_kpi_outputs.each_with_object(sum) do |hash, sum|
      hash.each { |key, value| sum[key] += value }
    end
  end

  def self.leaderboard_stats(accountables, end_at, time_period)
    # TODO: We would prefer this to return an AR relation and not an array
    stats = []
    accountables.each do |accountable|
      stats << reduced_accountable_stats(accountable, default_end_at(end_at), default_time_period(time_period))
    end
    sort_by_stat(stats)
  end

  def self.sort_by_score
    sort_by { |ps| -ps.score }
  end

  def self.reduced_accountable_stats(accountable, datetime, time_period)
    stats = time_period_stats(accountable, datetime, time_period)
    kpis = stats.map { |performance_stat| performance_stat.kpi }
    sum = Hash.new(0)
    kpi = kpis.each_with_object(sum) do |hash, sum|
      hash.each { |key, value| sum[key] += value }
    end
    new(kpi: kpi, accountable: accountable, start_at: beginning_of_time(datetime, time_period), end_at: end_of_time(datetime, time_period), kpi_type: stats.first.kpi_type)
  end

  def self.end_of_time(datetime, time_period)
    datetime.send("end_of_#{time_period}")
  end

  def self.beginning_of_time(datetime, time_period)
    datetime.send("beginning_of_#{time_period}")
  end

  def self.link_previous_params(datetime, time_period)
    link_params(datetime, time_period, true)
  end

  def self.link_next_params(datetime, time_period)
    link_params(datetime, time_period, false)
  end

  def self.link_params(datetime, time_period, previous = true)
    time_period = default_time_period(time_period)
    datetime = default_end_at(datetime)
    datetime = datetime.send("#{time_period.pluralize}_ago", 1) if previous
    datetime = next_period(datetime, time_period) unless previous
    {time_period: time_period, end_at: datetime.to_date}
  end

  def self.next_period(datetime, time_period)
    if datetime.send("next_#{time_period}") >= Date.current
      # Doesn't let the user
      Date.current
    else
      datetime.send("next_#{time_period}")
    end
  end

  def self.team_stats(team, end_at, time_period)
    datetime = default_end_at(end_at)
    case default_time_period(time_period)
    when "month"
      week_company_stats(datetime)
      # when "quarter"
      #   quarter_company_stats(datetime)
    when "year"
      year_company_stats(datetime)
    else
      week_company_stats(datetime)
    end
  end

  def self.company_stats(end_at, time_period)
    datetime = default_end_at(end_at)
    case default_time_period(time_period)
    when "month"
      week_company_stats(datetime)
      # when "quarter"
      #   quarter_company_stats(datetime)
    when "year"
      year_company_stats(datetime)
    else
      week_company_stats(datetime)
    end
  end

  def self.year_company_stats(datetime)
    year_kpi_outputs = Account.active_sales_accounts.map { |accountable| year_accountable_stats(accountable, datetime) }
    sum = Hash.new(0)
    year_kpi_outputs.each_with_object(sum) do |hash, sum|
      hash.each { |key, value| sum[key] += value }
    end
  end

  def self.week_company_stats(datetime)
    week_kpi_outputs = Account.active_sales_accounts.map { |accountable| PerformanceStat.week_stats(accountable, datetime).kpi }
    sum = Hash.new(0)
    week_kpi_outputs.each_with_object(sum) do |hash, sum|
      hash.each { |key, value| sum[key] += value }
    end
  end

  def self.company_kpi(performance_stats)
    total = {}
    performance_stats.map(&:kpi).each do |kpi_stats|
      kpi_stats.each do |k, v|
        if calculate_average?(k)
          total[k.to_s] = calculate_kpi_average(performance_stats, k)
        else
          total[k.to_s] = calculate_kpi_sum(performance_stats, k)
        end
      end
    end
    total
  end

  def self.calculate_kpi_sum(performance_stats, k)
    performance_stats.map(&:kpi).sum { |h| h[k] }
  end

  def self.calculate_kpi_average(performance_stats, k)
    arr = performance_stats.map(&:kpi).map { |k1| k1[k] }
    (arr.inject(&:+) / arr.size).ceil(2)
  end

  def self.calculate_average?(string)
    ['inspection_pass_fail_rate'].include?(string)
  end

  def set_kpi_values
    if accountable_type == "Account"
      if accountable.installer_id?
        set_installer_account_kpi_values
      else
        set_sales_account_kpi_values
      end
    end
  end

  def set_sales_account_kpi_values
    kpi["lead_count"] = accountable.week_lead_count(start_at)
    kpi["quality_sit_count"] = accountable.week_quality_sit_count(start_at)
    kpi["scheduled_install_count"] = accountable.week_scheduled_install_count(start_at)

    kpi["score"] = (kpi["lead_count"] +
      (kpi["quality_sit_count"] * 2) +
      (kpi["scheduled_install_count"] * 25))
    self.kpi_type = 'sales'
  end

  def set_installer_account_kpi_values
    kpi["kWh"] ||= 0.0 #accountable.week_lead_count(start_at)
    kpi["inspection_pass_count"] ||= 0 #accountable.week_quality_sit_count(start_at)
    kpi["inspection_fail_count"] ||= 0 #accountable.week_quality_sit_count(start_at)

    inspection_count = (kpi["inspection_pass_count"] + kpi["inspection_fail_count"])
    if inspection_count > 0
      kpi["inspection_pass_fail_rate"] = kpi["inspection_pass_count"] / inspection_count.to_f
    else
      kpi["inspection_pass_fail_rate"] = 1.00
    end
    kpi["overall"] = kpi["kWh"] * kpi["inspection_pass_fail_rate"]
    self.kpi_type = 'installers'
  end

  def self.sort_stats_by(stats, column)
    stats.sort_by { |statistic| -statistic.send(column) }
  end

  def self.sort_by_installer_stat(stats)
    stats.sort { |a, b| [-a.overall, -a.kWh] <=> [-b.overall, -b.kWh] }
  end

  def self.sort_by_stat(stats)
    kpi_types = stats.map(&:kpi_type).uniq
    case kpi_types
    when ['sales']
      sort_stats_by(stats, :score)
    when ['installers']
      sort_by_installer_stat(stats)
    else
      stats
    end
  end

  def self.reset_kpis
    update_all(kpi:
                 {"kWh"=>0.0,
                  "overall"=>0.0,
                  "inspection_fail_count"=>0,
                  "inspection_pass_count"=>0,
                  "inspection_pass_fail_rate"=>1.00})
  end

  def self.update_installer_stats(sf_projects)
    installer_stats.reset_kpis # Needs to clear previous stats so it doesn't continue to add them.
    # TODO: Don't want to just delete/recreate them, but we need a quick fix to release.
    sf_projects.each do |project|
      pstats = []
      installer = SalesforceClient.new.find_or_create_installer(project)
      install_date = project["Install_Complete_Date_Time__c"]&.to_datetime #safe operator needed?
      system_size = project["Final_System_Size__c"]
      inspections_passed = 0
      inspections_failed = 0
      # Issue is that running the rake task adds more to it and does not reset the count.
      # only update ones from this week, only purge ones from this week?
      if installer.present? && project["Final_System_Size__c"].present? && install_date.present?
        pstat = find_or_create_time_period_stats(installer.accounts.first, install_date, 'week').first
        pstat.kpi["kWh"] += project["Final_System_Size__c"].ceil(2)
        pstat.kpi["inspection_pass_count"] += inspections_passed
        pstat.kpi["inspection_fail_count"] += inspections_failed

        (pstats << pstat).flatten.uniq
      end
      pstats.each do |pstat|
        pstat.save
      end
    end
  end

  def verify_position_number
    stats = PerformanceStat.where(kpi_type: self.kpi_type).week(self.start_at)
    # TODO: Check if position is present in all hash items, refactor
    new_stat_order = stats.sort_by_stat(stats)
    if stats.all? { |stat| stat.position.present? }
      current_stat_order = stats.sort_by { |statistic| statistic.position }
      if new_stat_order != current_stat_order
        update_position_number(new_stat_order)
      end
    else
      update_position_number(new_stat_order)
    end
  end

  def update_position_number(new_stat_order)
    new_stat_order.each do |statistic|
      statistic.update_columns(position: (new_stat_order.find_index(statistic) + 1))
    end
  end
end
