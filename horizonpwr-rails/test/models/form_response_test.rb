# == Schema Information
#
# Table name: form_responses
#
#  id               :bigint           not null, primary key
#  respondable_type :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  dynamic_form_id  :bigint           not null
#  form_config_id   :bigint           not null
#  respondable_id   :bigint           not null
#
# Indexes
#
#  index_form_responses_on_dynamic_form_id  (dynamic_form_id)
#  index_form_responses_on_form_config_id   (form_config_id)
#  index_form_responses_on_respondable      (respondable_type,respondable_id)
#
# Foreign Keys
#
#  fk_rails_...  (dynamic_form_id => dynamic_forms.id)
#  fk_rails_...  (form_config_id => form_configs.id)
#
require "test_helper"

class FormResponseTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
