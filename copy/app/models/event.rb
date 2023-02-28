# == Schema Information
#
# Table name: events
#
#  id             :bigint           not null, primary key
#  action         :string
#  eventable_type :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  account_id     :bigint
#  eventable_id   :bigint           not null
#  user_id        :bigint
#
# Indexes
#
#  index_events_on_account_id  (account_id)
#  index_events_on_eventable   (eventable_type,eventable_id)
#  index_events_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
class Event < ApplicationRecord
  include ProjectFeedable

  belongs_to :user, optional: true
  # belongs_to :account, optional: true
  belongs_to :eventable, polymorphic: true
end
