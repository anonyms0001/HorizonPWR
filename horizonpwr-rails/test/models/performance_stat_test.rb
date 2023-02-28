# == Schema Information
#
# Table name: performance_stats
#
#  id               :bigint           not null, primary key
#  accountable_type :string           not null
#  end_at           :datetime         not null
#  kpi              :jsonb            not null
#  kpi_type         :string
#  position         :integer
#  start_at         :datetime         not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  accountable_id   :bigint           not null
#
# Indexes
#
#  index_performance_stats_on_accountable  (accountable_type,accountable_id)
#
require "test_helper"

class PerformanceStatTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
