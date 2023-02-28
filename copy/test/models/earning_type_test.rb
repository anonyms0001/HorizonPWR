# == Schema Information
#
# Table name: earning_types
#
#  id                         :bigint           not null, primary key
#  display_name               :string           not null
#  name                       :string           not null
#  percent                    :integer          not null
#  preferred_financial_option :boolean          not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#
require "test_helper"

class EarningTypeTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
