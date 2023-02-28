# == Schema Information
#
# Table name: earnings
#
#  id                     :bigint           not null, primary key
#  amount                 :decimal(, )
#  unit                   :integer          not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  downline_earning_id    :bigint           not null
#  payout_rate_variant_id :bigint           not null
#
# Indexes
#
#  index_earnings_on_downline_earning_id     (downline_earning_id)
#  index_earnings_on_payout_rate_variant_id  (payout_rate_variant_id)
#
# Foreign Keys
#
#  fk_rails_...  (downline_earning_id => earnings.id)
#  fk_rails_...  (payout_rate_variant_id => payout_rate_variants.id)
#
class Earning < ApplicationRecord
  belongs_to :downline_earning, class_name: "Earning", optional: true
  belongs_to :payout_rate_variant

  before_save :validate_earning

  def self.statuses
    # Pending: This is the initial status. If an Earning is Pending, it should not be included in a Payout.
    # Complete: The status should change to Complete when everything is finalized/complete.
    %w[pending complete]
  end

  def validate_earning
    # throw :abort
  end
end
