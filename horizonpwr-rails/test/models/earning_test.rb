# == Schema Information
#
# Table name: earnings
#
#  id                     :bigint           not null, primary key
#  amount                 :decimal(, )
#  status                 :string           default("pending"), not null
#  unit                   :decimal(, )      not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  address_id             :bigint           not null
#  appointment_id         :bigint
#  downline_earning_id    :bigint
#  payout_rate_variant_id :bigint           not null
#  project_id             :bigint
#  user_id                :bigint
#
# Indexes
#
#  index_earnings_on_address_id              (address_id)
#  index_earnings_on_appointment_id          (appointment_id)
#  index_earnings_on_downline_earning_id     (downline_earning_id)
#  index_earnings_on_payout_rate_variant_id  (payout_rate_variant_id)
#  index_earnings_on_project_id              (project_id)
#  index_earnings_on_user_id                 (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (appointment_id => appointments.id)
#  fk_rails_...  (downline_earning_id => earnings.id)
#  fk_rails_...  (payout_rate_variant_id => payout_rate_variants.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class EarningTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
