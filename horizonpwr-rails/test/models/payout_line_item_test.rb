# == Schema Information
#
# Table name: payout_line_items
#
#  id            :bigint           not null, primary key
#  itemable_type :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  itemable_id   :bigint           not null
#  payout_id     :bigint           not null
#
# Indexes
#
#  index_payout_line_items_on_itemable   (itemable_type,itemable_id)
#  index_payout_line_items_on_payout_id  (payout_id)
#
# Foreign Keys
#
#  fk_rails_...  (payout_id => payouts.id)
#
require "test_helper"

class PayoutLineItemTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
