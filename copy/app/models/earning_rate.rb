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
#  job_position_id :bigint           not null
#
# Indexes
#
#  index_earning_rates_on_earning_type_id  (earning_type_id)
#  index_earning_rates_on_job_position_id  (job_position_id)
#
# Foreign Keys
#
#  fk_rails_...  (earning_type_id => earning_types.id)
#  fk_rails_...  (job_position_id => job_positions.id)
#
class EarningRate < ApplicationRecord
  belongs_to :earning_type
  belongs_to :job_position

  validates_presence_of :earning_type
  validates_numericality_of :range_top, greater_than: 0
  validates_numericality_of :range_bottom, greater_than: 0
  validate :range_limits, :needs_amount

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

  def needs_amount
    amount ? nil : errors.add(:amount, "Not set yet")
  end
end
