# == Schema Information
#
# Table name: form_configs
#
#  id              :bigint           not null, primary key
#  active          :boolean          default(TRUE)
#  position        :integer
#  title           :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  dynamic_form_id :bigint           not null
#
# Indexes
#
#  index_form_configs_on_dynamic_form_id  (dynamic_form_id)
#
require "test_helper"

class FormConfigTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
