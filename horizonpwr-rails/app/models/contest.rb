# == Schema Information
#
# Table name: contests
#
#  id         :bigint           not null, primary key
#  end_at     :datetime
#  name       :string
#  start_at   :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Contest < ApplicationRecord
  # has_many :referrals, optional: true

  def active_status_color
    if start_at.future? && end_at.future?
      "purple"
    elsif start_at.past? && end_at.past?
      "red"
    else
      "green"
    end
  end

  def active
    if start_at.future? && end_at.future?
      "upcomming"
    elsif start_at.past? && end_at.past?
      "expired"
    else
      "active"
    end
  end
end
