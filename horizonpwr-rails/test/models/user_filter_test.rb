# == Schema Information
#
# Table name: user_filters
#
#  id         :bigint           not null, primary key
#  filter     :text             not null
#  name       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_user_filters_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class UserFilterTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
