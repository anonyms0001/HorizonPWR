# == Schema Information
#
# Table name: earning_types
#
#  id                         :bigint           not null, primary key
#  display_name               :string           not null
#  name                       :string           not null
#  percent                    :integer          not null
#  preferred_financial_option :boolean          not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  job_position_id            :bigint           not null
#
# Indexes
#
#  index_earning_types_on_job_position_id  (job_position_id)
#
# Foreign Keys
#
#  fk_rails_...  (job_position_id => job_positions.id)
#
require "test_helper"

class EarningTypeTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
