# == Schema Information
#
# Table name: earning_rates
#
#  id              :bigint           not null, primary key
#  active          :boolean          default(TRUE)
#  amount          :decimal(, )      not null
#  range_bottom    :integer
#  range_top       :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  earning_type_id :bigint           not null
#
# Indexes
#
#  index_earning_rates_on_earning_type_id  (earning_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (earning_type_id => earning_types.id)
#
class EarningRate < ApplicationRecord
  belongs_to :earning_type

  validates_presence_of :earning_type
  validates_numericality_of :range_top, greater_than: 0
  validates_numericality_of :range_bottom, greater_than: 0
  validate :range_limits, :needs_amount, :regional_manager_rates

  scope :active, -> { where(active: true) }

  def range_limits
    if range_bottom && range_top
      if range_bottom > range_top
        errors.add(:range_bottom, "can't be higher than range top")
        errors.add(:range_top, "can't be lower than range bottom")
      end
    else
      errors.add(:range_bottom, "range_limits not valid values")
      errors.add(:range_top, "range_limits not valid values")
    end
  end

  def range
    range_bottom..range_top
  end

  def needs_amount
    amount ? nil : errors.add(:amount, "Not set yet")
  end

  def regional_manager_rates
    if earning_type&.name&.downcase == "upline" # earning_type.job_position.name should always be "Regional Manager" in this case.
      active_rates = earning_type.earning_rates.active
      number_of_active_rates = active_rates.count
      # Rates cannot be equal, since one must always be higher than the other.
      if number_of_active_rates == 1 && active_rates.first.amount == amount
        errors.add(:amount, "cannot be the same as an existing rate.")
      end
      # There should only ever be two Upline Earning Rates (for Regional Managers).
      if active_rates.where.not(id: id).count == 2
        errors.add(:active, "- Can't have more than two active Upline rates.")
      end
    end
  end
end
