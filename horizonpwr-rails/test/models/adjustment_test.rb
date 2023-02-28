# == Schema Information
#
# Table name: adjustments
#
#  id              :bigint           not null, primary key
#  adjustable_type :string           not null
#  amount          :decimal(, )      not null
#  pay_back        :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  adjustable_id   :bigint           not null
#
# Indexes
#
#  index_adjustments_on_adjustable  (adjustable_type,adjustable_id)
#
require "test_helper"

class AdjustmentTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
