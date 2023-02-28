# == Schema Information
#
# Table name: field_configs
#
#  id             :bigint           not null, primary key
#  field_type     :integer          not null
#  label          :string
#  name           :string           not null
#  options        :text             is an Array
#  position       :integer
#  repeatable     :boolean          not null
#  required       :boolean          not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  form_config_id :bigint           not null
#
# Indexes
#
#  index_field_configs_on_form_config_id  (form_config_id)
#
# Foreign Keys
#
#  fk_rails_...  (form_config_id => form_configs.id)
#
require "test_helper"

class FieldConfigTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
