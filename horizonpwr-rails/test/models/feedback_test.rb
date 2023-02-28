# == Schema Information
#
# Table name: feedbacks
#
#  id          :bigint           not null, primary key
#  purpose     :string           not null
#  status      :string           default("new"), not null
#  title       :string           not null
#  votes_count :integer          default(0), not null
#  weight      :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  tracker_id  :string
#  user_id     :bigint           not null
#
# Indexes
#
#  index_feedbacks_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class FeedbackTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
