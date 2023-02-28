# == Schema Information
#
# Table name: finance_partners
#
#  id         :bigint           not null, primary key
#  active     :boolean          default(TRUE)
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class FinancePartner < ApplicationRecord
  # NOTE: Do we want fundings to be deleted if their FinancePartner gets destroyed?
  has_many :fundings, dependent: :destroy

  def preferred?
    ["Generations", "Cash"].include?(name)
  end
end
