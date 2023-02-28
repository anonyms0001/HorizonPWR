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
require "test_helper"

class FinancePartnerTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
