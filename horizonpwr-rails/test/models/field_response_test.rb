# == Schema Information
#
# Table name: field_responses
#
#  id                 :bigint           not null, primary key
#  response           :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  field_config_id    :bigint           not null
#  form_response_id   :bigint           not null
#  last_updated_by_id :bigint
#
# Indexes
#
#  index_field_responses_on_field_config_id     (field_config_id)
#  index_field_responses_on_form_response_id    (form_response_id)
#  index_field_responses_on_last_updated_by_id  (last_updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (field_config_id => field_configs.id)
#  fk_rails_...  (form_response_id => form_responses.id)
#  fk_rails_...  (last_updated_by_id => users.id)
#
require "test_helper"

class FieldResponseTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
