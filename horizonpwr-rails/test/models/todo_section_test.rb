# == Schema Information
#
# Table name: todo_sections
#
#  id           :bigint           not null, primary key
#  active       :boolean
#  name         :string
#  position     :integer
#  slug         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  todo_list_id :bigint           not null
#
# Indexes
#
#  index_todo_sections_on_todo_list_id  (todo_list_id)
#
# Foreign Keys
#
#  fk_rails_...  (todo_list_id => todo_lists.id)
#
require "test_helper"

class TodoSectionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
