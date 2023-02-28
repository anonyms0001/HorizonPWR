# == Schema Information
#
# Table name: payout_rate_variants
#
#  id              :bigint           not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  earning_rate_id :bigint           not null
#  earning_type_id :bigint           not null
#  payout_id       :bigint           not null
#
# Indexes
#
#  index_payout_rate_variants_on_earning_rate_id  (earning_rate_id)
#  index_payout_rate_variants_on_earning_type_id  (earning_type_id)
#  index_payout_rate_variants_on_payout_id        (payout_id)
#
# Foreign Keys
#
#  fk_rails_...  (earning_rate_id => earning_rates.id)
#  fk_rails_...  (earning_type_id => earning_types.id)
#  fk_rails_...  (payout_id => payouts.id)
#
class PayoutRateVariant < ApplicationRecord
  belongs_to :payout
  belongs_to :earning_rate
  belongs_to :earning_type
  has_many :earnings

  def initialize(attributes = {})
    super({payout: attributes[:payout],
           earning_type: attributes[:earning_type],
           earning_rate: EarningRate.find_by(earning_type: attributes[:earning_type])}) # This gets updated after_commit, just need a place holder here
    earnings << attributes[:earnings] if attributes[:earnings].present?
  end

  def find_earning_rate
    # If it's a new hire bonus, then the earning rate amount is either 0 or the total, nothing between
    quantity = payout.earning_type_count(earning_type)
    EarningRate.active.where("earning_type_id = ? and range_bottom <= ? and range_top >= ?", earning_type_id, quantity, quantity).first
  end

  def update_earning_rate
    update(earning_rate: find_earning_rate)
  end
end
# Earning.create!(unit: 1, address: Address.first, user: User.find(128))
