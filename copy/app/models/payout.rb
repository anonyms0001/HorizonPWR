# == Schema Information
#
# Table name: payouts
#
#  id             :bigint           not null, primary key
#  approved_at    :datetime
#  paid_at        :datetime
#  pay_date       :date             not null
#  pay_total      :integer
#  status         :string           default("pending"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  approved_by_id :bigint
#  paid_by_id     :bigint
#  user_id        :bigint           not null
#
# Indexes
#
#  index_payouts_on_approved_by_id  (approved_by_id)
#  index_payouts_on_paid_by_id      (paid_by_id)
#  index_payouts_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (approved_by_id => users.id)
#  fk_rails_...  (paid_by_id => users.id)
#  fk_rails_...  (user_id => users.id)
#
class Payout < ApplicationRecord
  belongs_to :user
  belongs_to :approved_by, class_name: "User", optional: true
  belongs_to :paid_by, class_name: "User", optional: true
  has_many :payout_line_items

  def self.statuses
    %w[approved pending paid]
  end

  def status_color
    case status
    when "pending"
      "blue"
    when "approved"
      "indigo"
    when "paid"
      "green"
    end
  end
end
