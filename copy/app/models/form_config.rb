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
class FormConfig < ApplicationRecord
  belongs_to :dynamic_form
  has_many :field_configs, dependent: :destroy
  # NOTE: The below line breaks the tests, since FieldResponses do not have a form_config_id field.
  # has_many :field_responses, dependent: :destroy
  has_many :form_responses, dependent: :destroy
  # acts_as_list
  #
  validates :title, presence: true

  scope :active, -> { where(active: true) }
  scope :sorted_by_position, -> { order(position: :asc) }

  def completed?
    form_responses.any? && form_responses&.last&.completed?
  end
end
