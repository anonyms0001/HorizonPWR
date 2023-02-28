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
class FieldConfig < ApplicationRecord
  include ActiveModel::Validations

  before_save :remove_empty_options
  before_create :sanitize_title

  belongs_to :form_config
  has_many :field_response, dependent: :destroy

  has_rich_text :description

  validates :title, presence: true
  validates_with OptionsValidator

  def self.field_types
    %w[text_field text_area number_field check_box select]
  end

  private

  def field_type_is_select?
    field_type == "select"
  end

  def sanitize_title
    self.title = title.strip.tr(" ", "_")
  end

  def remove_empty_options
    self.options = options&.reject(&:blank?)
  end
end
