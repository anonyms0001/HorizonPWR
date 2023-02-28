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
class FieldConfig < ApplicationRecord
  belongs_to :form_config

  enum field_type: {
    text_field: 0,
    text_area: 1,
    select: 2,
    check_box: 3,
    number_field: 4
  }, _suffix: true
end
