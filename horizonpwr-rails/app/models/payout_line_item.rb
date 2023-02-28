# == Schema Information
#
# Table name: payout_line_items
#
#  id            :bigint           not null, primary key
#  itemable_type :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  itemable_id   :bigint           not null
#  payout_id     :bigint           not null
#
# Indexes
#
#  index_payout_line_items_on_itemable   (itemable_type,itemable_id)
#  index_payout_line_items_on_payout_id  (payout_id)
#
# Foreign Keys
#
#  fk_rails_...  (payout_id => payouts.id)
#
class PayoutLineItem < ApplicationRecord
  belongs_to :payout
  belongs_to :itemable, polymorphic: true

  delegated_type :itemable, types: %w[Earning Adjustment]

  # Determines which Payout to use
  def expected_pay_date
    (Date.today.end_of_week - 3.days) + 2.weeks
  end

  def unit
    itemable_type == "Adjustment" ? 1 : itemable.unit
  end

  def line_item_type
    itemable_type == "Adjustment" ? "Adjustment" : itemable.earning_type.display_name
  end

  def line_item_type_detail
    itemable_type == "Adjustment" ? "-" : itemable.earning_type.name
  end

  def rate
    itemable_type == "Adjustment" ? itemable.amount : itemable.earning_rate.amount
  end

  def total
    itemable.total
  end
end
