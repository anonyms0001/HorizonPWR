# == Schema Information
#
# Table name: contests
#
#  id         :bigint           not null, primary key
#  end_at     :datetime
#  name       :string
#  start_at   :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "test_helper"

class ContestTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
