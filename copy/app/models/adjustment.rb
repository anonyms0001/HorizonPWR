# == Schema Information
#
# Table name: adjustments
#
#  id         :bigint           not null, primary key
#  amount     :decimal(, )      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Adjustment < ApplicationRecord
  has_rich_text :description
end
