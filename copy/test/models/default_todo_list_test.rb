# == Schema Information
#
# Table name: default_todo_lists
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "test_helper"

class DefaultTodoListTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
