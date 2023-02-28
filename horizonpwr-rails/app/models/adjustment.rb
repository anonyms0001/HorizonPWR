# == Schema Information
#
# Table name: adjustments
#
#  id              :bigint           not null, primary key
#  adjustable_type :string           not null
#  amount          :decimal(, )      not null
#  pay_back        :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  adjustable_id   :bigint           not null
#
# Indexes
#
#  index_adjustments_on_adjustable  (adjustable_type,adjustable_id)
#
class Adjustment < ApplicationRecord
  belongs_to :adjustable, polymorphic: true

  has_rich_text :description

  validates :description, presence: true
  validates :amount, presence: true

  def self.collection_total(collection)
    collection.map(&:total).inject(0) { |sum, x| sum + x }
  end

  def self.create_adjustment
    PayoutLineItem.create!(itemable: adjustment, payout: payout)
  end

  def total
    amount
  end

  def status_color
    case status
    when "pending"
      "blue"
    when "accrued"
      "green"
    when "lost"
      "red"
    when "paid"
      "purple"
    when "pending_pay"
      "blue"
    when "pending_loss"
      "yellow"
    end
  end

  def status
    "adjustments"
  end
end
