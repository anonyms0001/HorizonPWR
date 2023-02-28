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
class CalendarNote < ApplicationRecord
  has_one :note, as: :notable, dependent: :destroy
  accepts_nested_attributes_for :note

  def find_or_build_note
    note || build_note
  end
end
