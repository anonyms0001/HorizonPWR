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
#  job_position_id            :bigint           not null
#
# Indexes
#
#  index_earning_types_on_job_position_id  (job_position_id)
#
# Foreign Keys
#
#  fk_rails_...  (job_position_id => job_positions.id)
#
class EarningType < ApplicationRecord
  has_many :earning_rates
  has_many :payout_rate_variants
  belongs_to :job_position
  # accepts_nested_attributes_for :earning_rates
  # validates_presence_of :earning_rates
  # validates_associated :earning_rates

  def earnings
    payout_rate_variants
    Payout.payout_rate_variants.earning_types.each do |earning_type|
      # payout.payout_rate_variant.where(earning_type: earning_type)
      Payout.earnings.where(payout_rate_variant: earning_type)
    end

    # return earnings
  end
end
