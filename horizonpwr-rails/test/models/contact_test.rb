# == Schema Information
#
# Table name: contacts
#
#  id                        :bigint           not null, primary key
#  archived                  :boolean          default(FALSE), not null
#  birth_date                :datetime
#  email                     :string
#  first_name                :string
#  gender                    :boolean
#  last_name                 :string
#  lead_source               :string
#  phone                     :string
#  phone1                    :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  account_id                :bigint
#  active_campaign_id        :integer
#  canvass_contact_id        :string
#  salesforce_lead_id        :string
#  salesforce_opportunity_id :string
#  secure_public_id          :string
#  user_id                   :bigint
#
# Indexes
#
#  index_contacts_on_account_id                 (account_id)
#  index_contacts_on_active_campaign_id         (active_campaign_id) UNIQUE
#  index_contacts_on_canvass_contact_id         (canvass_contact_id)
#  index_contacts_on_salesforce_lead_id         (salesforce_lead_id)
#  index_contacts_on_salesforce_opportunity_id  (salesforce_opportunity_id)
#  index_contacts_on_secure_public_id           (secure_public_id) UNIQUE
#  index_contacts_on_user_id                    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class ContactTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
