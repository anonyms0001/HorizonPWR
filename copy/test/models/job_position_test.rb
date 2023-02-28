# == Schema Information
#
# Table name: job_positions
#
#  id         :bigint           not null, primary key
#  active     :boolean          default(TRUE), not null
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "test_helper"

class JobPositionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
