# == Schema Information
#
# Table name: earnings
#
#  id                     :bigint           not null, primary key
#  amount                 :decimal(, )
#  status                 :string           default("pending"), not null
#  unit                   :decimal(, )      not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  address_id             :bigint           not null
#  appointment_id         :bigint
#  downline_earning_id    :bigint
#  payout_rate_variant_id :bigint           not null
#  project_id             :bigint
#  user_id                :bigint
#
# Indexes
#
#  index_earnings_on_address_id              (address_id)
#  index_earnings_on_appointment_id          (appointment_id)
#  index_earnings_on_downline_earning_id     (downline_earning_id)
#  index_earnings_on_payout_rate_variant_id  (payout_rate_variant_id)
#  index_earnings_on_project_id              (project_id)
#  index_earnings_on_user_id                 (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (appointment_id => appointments.id)
#  fk_rails_...  (downline_earning_id => earnings.id)
#  fk_rails_...  (payout_rate_variant_id => payout_rate_variants.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (user_id => users.id)
#
class Earning < ApplicationRecord
  belongs_to :downline_earning, class_name: "Earning", optional: true
  belongs_to :payout_rate_variant
  belongs_to :user
  belongs_to :address
  belongs_to :appointment
  belongs_to :project
  has_one :payout_line_item, as: :itemable, dependent: :destroy
  has_one :earning_rate, through: :payout_rate_variant
  has_one :earning_type, through: :payout_rate_variant
  has_one :payout, through: :payout_line_item
  has_many :adjustments, as: :adjustable

  before_save :validate_earning

  validates :unit, presence: true

  after_commit :update_rate

  # Earning.create!(appointment: Appointment.first, user: User.find(997))
  # Earning.create!(appointment: Appointment.first, user: User.find(997), earning_type: 'backend')
  # Earning.create!(appointment: Appointment.first, user: User.find(997), earning_type: 'bonus')
  #
  # earning_type = EarningType.find_by(job_position_id: User.find(997).job_position_id, name: 'backend', preferred_financial_option: true )
  # Earning.create!(appointment: Appointment.first, user: User.find(997), earning_type: earning_type, unit: kWh)

  # cash deals, preferred
  # FM Bonuses for weeks 1..3
  # Maybe we should add some scopes to User like

  # Dollar amount, for kWn backend earnings
  # pay_date for bonuses needs to be scheduled for the quarter
  # overrides ?

  def initialize(attributes = {})
    if attributes[:earning_type].is_a?(String)
      attributes[:earning_type] = EarningType.find_by(name: attributes[:earning_type], job_position_id: attributes[:user].job_position_id, preferred_financial_option: false)
    elsif !attributes[:earning_type].is_a?(EarningType)
      attributes[:earning_type] = EarningType.find_by(name: "frontend", job_position_id: attributes[:user].job_position_id, preferred_financial_option: false) # defaults to a frontend earning
    end
    attributes[:address] ||= attributes[:appointment]&.address || attributes[:project]&.address
    attributes[:appointment] ||= attributes[:project].appointments.first
    attributes[:unit] ||= if attributes[:earning_type].name == "frontend"
      1
    else
      attributes[:project]&.system_size || 1
    end
    # unit is system size unless job_position is field marketer and earning_type is front end
    super(attributes)
    Honeybadger.context({attributes: attributes, earning: self})

    # backend override upline1 upline2
    pay_date = attributes[:earning_type]&.name != "bonus" ? Payout.default_pay_date : Payout.default_pay_date_bonuses
    payout = Payout.find_or_create_by(user: user, pay_date: pay_date)
    self.payout_rate_variant = PayoutRateVariant.find_or_initialize_by(payout: payout, earning_type: attributes[:earning_type])
    payout.payout_line_items << payout.payout_line_items.new(itemable: self)
  end

  def update_rate
    payout_rate_variant.update_earning_rate
  end

  def previously_earned_sit?
    address.earnings.map(&:user).include?(appointment.created_by)
  end

  def self.clear_all
    Earning.delete_all
    PayoutRateVariant.delete_all
    PayoutLineItem.delete_all
    Payout.delete_all
  end

  def self.create_new_earning!(user, type = nil, preferred = false, appointment = nil, project = nil)
    unit = project&.system_size || 1
    earning_type = EarningType.find_by(job_position_id: user.job_position_id, name: type, preferred_financial_option: preferred) if type.present?
    Earning.create!(address: address, user: user, earning_type: earning_type, unit: unit, project: project)
  end

  # Earning.last.transfer_to(User.find(128))
  # Earning.last.transfer_to(User.find(970))
  # Earning.last.transfer_to(User.find(997))
  # Earning.last.transfer_to(User.find(985))
  def can_transfer?(user)
    result = user != self.user &&
      ["frontend", "backend"].include?(earning_type.name) &&
      status == "pending" &&
      (user.job_position_name == self.user.job_position_name ||
        ![user.job_position_name, self.user.job_position_name].include?(JobPosition.first.name))
    if result == false
      Honeybadger.context(self: self, user: user)
      Honeybadger.notify("Can not transfer Earning")
    end
    result
  end

  def transfer_to(user)
    return false unless can_transfer?(user)
    ActiveRecord::Base.transaction do
      Earning.create!(appointment: appointment, user: user, earning_type: earning_type.name)
      destroy!
    end
  end

  # NOTE: Removed because there is now a `status` column
  # def status
  #   valid?
  # end

  def self.statuses
    %w[pending accrued lost paid pending_pay pending_loss]

    # When do we set the amount column on an earning?
    # Is it based on status?
    # This is the point in time in which we no longer change the payout_rate_variant calculation for an earning
  end

  def self.something
    #   @user = User.find(374) # FM
    @user = User.find(351) # EC
    @address = Address.last # Residential
    @project = nil
    Earning.create_earning!("backend", @user, @address, @project)
  end

  #
  # def self.move_payout_line_item_to_future_payout(payout_line_item, pay_date)
  #   # Thinking out loud
  # end
  #
  # def self.create_automatic_adjustment
  #   #  When a rep has been issued an advance, we want to automatically create an adjustment for 100% of
  #   all new earnings or the remainder of the adjustment needed to repay the advance(which ever is smaller)
  # end
  #
  # def self.change_earning_payee(type, user, address = nil, project = nil)
  #  When a the earning belongs to someone else
  # end
  #
  # def move_payout_line_item_to_next_payout
  #  pay_date = payout_line_item.pay_date + 1.week
  #  Earning.move_payout_line_item_to_future_payout(payout_line_item, pay_date)
  # end

  def previous_quality_sit?(employee)
    earning_type = EarningType.find_by(name: "frontend", job_position_id: 8)
    Earning.previous_earnings(earning_type, address, employee).any?
  end

  def previous_quality_sit_paid?(employee)
    previous_quality_sit?(employee) && payout.paid_at?
  end

  def self.create_quality_sit!(employee, address, project = nil)
    # NOTE: Per Judd, a Rep is NOT eligible for a front end bonus if they get a Quality Sit,
    # when they do not qualify for the Earning because of previously having knocked that door.
    #
    # NOTE: Do not block based on job position... If I am an fm that gets promoted at the end of the week,
    # I should still get any future QS earnings for consults scheduled after my promotion occurs
    #
    # NOTE: We think this is the only time we care about what a person's job_position was, and not what it is.
    #
    # NOTE: It feels weird to create a quality sit from an address rather than an appointment,
    # but we don't have a trigger for that just yet.
    # In the future if canvass lets us add interactions to an appointment, then we may be able to change this then.
    #
    previous_earnings = Earning.where(address: address).where(
      "created_at > ? AND created_at < ?", Time.now.beginning_of_day, Time.now.end_of_day
    )
    # Find the job position of the created_by at the time the appointment was created.
    appointment = address.appointments.where(
      appointment_type: "consult",
      created_by_id: employee,
      archived: false
    ).last
    job_position = appointment.created_by_position

    unless job_position.nil?
      appointment.update(created_by_position: appointment.created_by.job_position)
      :abort
    end

    if !previous_earnings.any? && job_position&.name == "Field Marketer"
      earning = Earning.create_earning!("frontend", employee, address, project)
      if earning.previous_quality_sit_paid?(employee)
        adjustment = earning.adjustments.create(
          amount: (earning.total * -1),
          description: "System: FM was previously paid for this quality sit"
        )
        PayoutLineItem.create!(itemable: adjustment, payout: earning.payout)
      end
    end
  end

  def self.previous_earnings(earning_type, address, employee)
    Earning.includes(:payout, :payout_rate_variant).where(
      address: address,
      payout: {user: employee},
      payout_rate_variant: {earning_type: earning_type}
    )
  end

  def self.create_earning!(type, user, address = nil, project = nil)
    # TODO: Clean up this ugly transaction.

    ActiveRecord::Base.transaction do
      if project.nil? && address.nil? || user.nil?
        throw :abort
      elsif address.nil?
        address = project.address
      end
      preferred_financial_option = project.present? ? project.finance_partner.preferred? : false

      earning_type = if ["Field Marketer", "Field Marketer Elite"].include?(user.job_position_name) || ["bonus", "override", "upline"].include?(type)
        EarningType.find_by(name: type, job_position: user.job_position)
      else
        EarningType.find_by(name: type, job_position: user.job_position, preferred_financial_option: preferred_financial_option)
      end
      Honeybadger.notify("JobPosition Missing an Earning Type") unless earning_type.present?
      # TODO: [Earnings] Triggering of Status Changes WIP: Uncomment the two lines below.
      # quality_sit = "accrued" if earning_type.display_name.downcase == 'quality sit'
      # earning_status = quality_sit ? "accrued" : nil

      kwh = project&.system_size || 1
      # Needs to know that a QS is always 1. If it's for a FM, I think it's always 1, but if it's an EC, then it's based on the system size...?
      pay_date = (Date.today.end_of_week - 2.days) + 2.weeks # -2.days because thursdays
      # TODO: dynamically choose pay_date based on EarningType
      # Bonuses are scheduled for the first payout of the next quarter
      # All other earnings scheduled for 2 weeks from date "accrued"
      # TODO: Earnings need an "accrued_at" datetime, and quarter_created?

      payout = Payout.find_or_create_by!(user_id: user.id, pay_date: pay_date)
      payout_rate_variant = PayoutRateVariant.find_or_initialize_by(payout: payout, earning_type: earning_type)
      # it doesn't change the rate when a new earning is created.
      earnings_count = payout_rate_variant.earnings.size + 1

      if payout_rate_variant.earning_rate.nil?
        earning_rate = earning_type.earning_rates.where("active = true and range_bottom <= ? and range_top >= ?", earnings_count, earnings_count).first
        payout_rate_variant.update(earning_rate: earning_rate)
      elsif !payout_rate_variant.earning_rate.nil? && payout_rate_variant.earning_rate.range.include?(earnings_count)
        # Line intentionally blank. The rate is still the same and doesn't need to change; but we also want to capture any exceptions
      elsif !payout_rate_variant.earning_rate.nil? && !payout_rate_variant.earning_rate.range.include?(earnings_count)
        earning_rate = earning_type.earning_rates.where("active = true and range_bottom <= ? and range_top >= ?", earnings_count, earnings_count).first
        payout_rate_variant.update(earning_rate: earning_rate)
      else
        throw :abort
      end
      payout_rate_variant.save! unless payout_rate_variant.earning_rate == earning_rate && payout_rate_variant.persisted?
      # TODO: [Earnings] Triggering of Status Changes WIP: Swap the two lines below that set `earning`.
      # earning = Earning.create!(unit: kwh, address_id: address.id, project_id: project&.id, payout_rate_variant_id: payout_rate_variant.id, status: earning_status)
      earning = Earning.create!(unit: kwh, address_id: address.id, project_id: project&.id, payout_rate_variant_id: payout_rate_variant.id)
      PayoutLineItem.create!(itemable: earning, payout: payout)
      earning
    end
  end

  # [Earnings] Triggering of Status Changes WIP
  def earning_logic
    "accrued" if condition

    earning_type.name
    job_position
  end

  def total
    amount || unit * earning_rate.amount * (earning_type.percent / 100.00)
  end

  def self.total
    Earning.all.map(&:total).inject(0) { |sum, x| sum + x }
  end

  def self.active
    Earning.where(active: true)
  end

  def validate_earning
    # throw :abort
  end

  def status_color
    case status
    when "pending"
      "blue"
    when "accrued"
      "green"
    when "lost"
      "red"
    when "paid"
      "purple"
    when "pending_pay"
      "blue"
    when "pending_loss"
      "yellow"
    end
  end
end
