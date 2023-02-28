# == Schema Information
#
# Table name: job_positions
#
#  id            :bigint           not null, primary key
#  active        :boolean          default(TRUE), not null
#  hiring        :boolean          default(FALSE)
#  hiring_public :boolean          default(FALSE)
#  leadership    :boolean          default(FALSE)
#  name          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  department_id :bigint
#
# Indexes
#
#  index_job_positions_on_department_id  (department_id)
#
require "test_helper"

class JobPositionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
