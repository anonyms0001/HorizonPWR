# == Schema Information
#
# Table name: earning_types
#
#  id                         :bigint           not null, primary key
#  display_name               :string           not null
#  name                       :string           not null
#  percent                    :integer          not null
#  preferred_financial_option :boolean          not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#
class EarningType < ApplicationRecord
  has_many :earning_rates
  accepts_nested_attributes_for :earning_rates
  # validates_presence_of :earning_rates
  validates_associated :earning_rates
end
