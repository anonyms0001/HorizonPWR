# == Schema Information
#
# Table name: todo_lists
#
#  id            :bigint           not null, primary key
#  listable_type :string           not null
#  name          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  listable_id   :bigint           not null
#
# Indexes
#
#  index_todo_lists_on_listable  (listable_type,listable_id)
#
require "test_helper"

class TodoListTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
