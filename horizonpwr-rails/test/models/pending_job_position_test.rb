# == Schema Information
#
# Table name: pending_job_positions
#
#  id              :bigint           not null, primary key
#  effective_at    :date             not null
#  status          :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  created_by_id   :bigint           not null
#  job_position_id :bigint           not null
#  user_id         :bigint           not null
#
# Indexes
#
#  index_pending_job_positions_on_created_by_id    (created_by_id)
#  index_pending_job_positions_on_job_position_id  (job_position_id)
#  index_pending_job_positions_on_user_id          (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (job_position_id => job_positions.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class PendingJobPositionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
