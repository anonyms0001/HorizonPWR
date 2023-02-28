# == Schema Information
#
# Table name: referrals
#
#  id                  :bigint           not null, primary key
#  eligible            :string           default("unchecked"), not null
#  email               :string           not null
#  first_name          :string           not null
#  last_name           :string           not null
#  phone               :string
#  referrer_address    :string
#  referrer_email      :string
#  referrer_first_name :string
#  referrer_last_name  :string
#  referrer_phone      :string
#  status              :string           default("to_contact"), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  contest_id          :bigint
#  referral_contact_id :bigint
#  referrer_contact_id :bigint
#  user_id             :integer
#
# Indexes
#
#  index_referrals_on_contest_id           (contest_id)
#  index_referrals_on_referral_contact_id  (referral_contact_id)
#  index_referrals_on_referrer_contact_id  (referrer_contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (contest_id => contests.id)
#  fk_rails_...  (referral_contact_id => contacts.id)
#  fk_rails_...  (referrer_contact_id => contacts.id)
#
require "test_helper"

class ReferralTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
