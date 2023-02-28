# == Schema Information
#
# Table name: todo_items
#
#  id               :bigint           not null, primary key
#  active           :boolean
#  description_slug :string
#  position         :integer          not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  todo_section_id  :bigint           not null
#
# Indexes
#
#  index_todo_items_on_todo_section_id  (todo_section_id)
#
# Foreign Keys
#
#  fk_rails_...  (todo_section_id => todo_sections.id)
#
require "test_helper"

class TodoItemTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
