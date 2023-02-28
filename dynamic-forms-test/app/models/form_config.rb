# == Schema Information
#
# Table name: form_configs
#
#  id         :bigint           not null, primary key
#  active     :boolean
#  model      :string
#  position   :integer
#  title      :string
#  use_case   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class FormConfig < ApplicationRecord
  has_many :field_configs, dependent: :destroy
end
