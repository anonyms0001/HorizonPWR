# == Schema Information
#
# Table name: dynamic_forms
#
#  id         :bigint           not null, primary key
#  model      :string           not null
#  sequential :boolean          default(FALSE)
#  use_case   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "test_helper"

class DynamicFormTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
