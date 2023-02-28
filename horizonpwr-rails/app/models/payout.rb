# == Schema Information
#
# Table name: payouts
#
#  id             :bigint           not null, primary key
#  approved_at    :datetime
#  paid_at        :datetime
#  pay_date       :date             not null
#  pay_total      :integer
#  status         :string           default("pending"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  approved_by_id :bigint
#  paid_by_id     :bigint
#  user_id        :bigint           not null
#
# Indexes
#
#  index_payouts_on_approved_by_id  (approved_by_id)
#  index_payouts_on_paid_by_id      (paid_by_id)
#  index_payouts_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (approved_by_id => users.id)
#  fk_rails_...  (paid_by_id => users.id)
#  fk_rails_...  (user_id => users.id)
#
class Payout < ApplicationRecord
  belongs_to :user
  belongs_to :approved_by, class_name: "User", optional: true
  belongs_to :paid_by, class_name: "User", optional: true
  has_many :payout_line_items
  has_many :payout_rate_variants
  has_many :earning_types, through: :payout_rate_variants
  has_many :adjustments, through: :payout_line_items, source: :itemable, source_type: "Adjustment"
  has_many :job_positions, through: :earning_types
  has_many :earnings, through: :payout_rate_variants

  accepts_nested_attributes_for :payout_line_items

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:pay_date, :status, :pay_total, :paid_at, :approved_at],
    associated_against: {
      user: [:first_name, :last_name],
      job_positions: [:name]
    },
    using: {tsearch: {prefix: true}}

  def initialize(attributes = {})
    attr_with_defaults = {
      pay_date: Payout.default_pay_date
    }
    attr_with_defaults.merge!(attributes) unless attributes.nil?
    super(attr_with_defaults)
  end

  def self.pay_date_current_week
    Date.today.end_of_week - 2.days
  end

  def self.default_pay_date
    pay_date_current_week + 1.weeks
  end

  def self.default_pay_date_bonuses
    (Date.today.end_of_quarter.end_of_week - 2.days) + 1.weeks
  end

  def self.default_date_selectors
    date = default_pay_date
    arr = []
    5.times do
      arr << date
      date += 7.days
    end
    arr
  end

  def earning_type_count(earning_type)
    earnings.includes(:earning_type).map(&:earning_type).count(earning_type)
  end

  def payout_total
    pay_total || payout_line_items.map(&:total).inject(0) { |sum, x| sum + x }
  end

  def earnings_total_by_type(earning_type)
    payout_rate_variant = PayoutRateVariant.find_by(payout: self, earning_type: earning_type)
    payout_rate_variant.earnings.map(&:total).inject(0) { |sum, x| sum + x }
  end

  def self.statuses
    %w[approved pending paid]
  end

  def status_color
    case status
    when "pending"
      "blue"
    when "approved"
      "indigo"
    when "paid"
      "green"
    end
  end

  private

  def assign_defaults_on_new
    self.pay_date = (Date.today.end_of_week - 2.days) + 2.weeks
  end
end
