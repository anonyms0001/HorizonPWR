# == Schema Information
#
# Table name: completed_todo_items
#
#  id              :bigint           not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  completed_by_id :bigint           not null
#  todo_item_id    :bigint           not null
#
# Indexes
#
#  index_completed_todo_items_on_completed_by_id  (completed_by_id)
#  index_completed_todo_items_on_todo_item_id     (todo_item_id)
#
# Foreign Keys
#
#  fk_rails_...  (completed_by_id => users.id)
#
require "test_helper"

class CompletedTodoItemTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
