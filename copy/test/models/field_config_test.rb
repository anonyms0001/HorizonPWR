# == Schema Information
#
# Table name: field_configs
#
#  id               :bigint           not null, primary key
#  active           :boolean          default(TRUE), not null
#  eventable_action :string
#  field_type       :string           not null
#  label            :string
#  options          :text             is an Array
#  position         :integer
#  repeatable       :boolean          not null
#  required         :boolean          not null
#  title            :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  form_config_id   :bigint           not null
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
  test "blank strings are removed on save" do
    @field_config = field_configs(:has_options)
    @field_config.update(options: ["One", "Two", ""])
    @field_config.save
    assert_equal ["One", "Two"], @field_config.options
    refute_equal ["One", "Two", ""], @field_config.options
  end
end
