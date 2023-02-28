# == Schema Information
#
# Table name: funding_payments
#
#  id           :bigint           not null, primary key
#  amount       :decimal(, )
#  payment_type :string           not null
#  received_at  :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  funding_id   :bigint           not null
#
# Indexes
#
#  index_funding_payments_on_funding_id  (funding_id)
#
# Foreign Keys
#
#  fk_rails_...  (funding_id => fundings.id)
#
require "test_helper"

class FundingPaymentTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
