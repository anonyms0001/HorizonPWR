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
require "test_helper"

class EarningRateTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
