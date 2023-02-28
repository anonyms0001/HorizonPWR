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
require "test_helper"

class EarningTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
