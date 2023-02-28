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
class DynamicForm < ApplicationRecord
  has_many :form_configs, dependent: :destroy
  has_many :form_responses, dependent: :destroy

  validates :model, presence: true
  validates :use_case, presence: true

  def sorted_active_form_configs
    form_configs.where(active: true).order(position: :asc)
  end

  # def active_tab
  #   form_configs.where(active: true).order(position: :asc).map { |x| x unless x.completed? }.reject(&:blank?).first
  # end
end
