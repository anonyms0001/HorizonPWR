# == Schema Information
#
# Table name: votes
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  feedback_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_votes_on_feedback_id  (feedback_id)
#  index_votes_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (feedback_id => feedbacks.id)
#  fk_rails_...  (user_id => users.id)
#
class Vote < ApplicationRecord
  belongs_to :user
  belongs_to :feedback, counter_cache: true
end
