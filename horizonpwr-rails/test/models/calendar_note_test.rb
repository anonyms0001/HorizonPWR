# == Schema Information
#
# Table name: calendar_notes
#
#  id         :bigint           not null, primary key
#  active     :boolean          default(TRUE), not null
#  date       :datetime
#  global     :boolean
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "test_helper"

class CalendarNoteTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
