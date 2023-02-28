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
class FormResponse < ApplicationRecord
  RESPONSES = FieldConfig.all.map(&:title).uniq.reject(&:empty?).sort
  # TODO: only allow formfields that are part of that specific form. not part of just any form.
  # TODO: Titles must be unique on field_configs if this is to work this way.

  belongs_to :respondable, polymorphic: true
  belongs_to :dynamic_form
  belongs_to :form_config
  has_many :field_responses, dependent: :destroy
  has_many :field_configs, through: :form_config

  accepts_nested_attributes_for :field_responses

  def completed?
    # FormResponse is completed if all required FieldConfigs are completed.
    field_configs.map do |x|
      x.active? &&
        x.field_response.present? &&
        !x.required? ||
        x.active? &&
          x.field_response.present? &&
          x.required? &&
          x.field_response.first.completed?
    end.uniq == [true]
  end

  def self.respondables_with_filled_fields(model, field_title)
    form_response_ids = FieldResponse.fields_with_filled_fields(model, field_title).map(&:form_response_id)
    FormResponse.where(respondable_type: model.to_s, id: form_response_ids).map(&:respondable_id)
  end

  def sorted_active_field_configs
    field_configs.where(active: true).order(position: :asc)
  end
end
