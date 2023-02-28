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
require "test_helper"

class PayoutRateVariantTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
