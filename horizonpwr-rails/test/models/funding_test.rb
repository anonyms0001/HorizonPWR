# == Schema Information
#
# Table name: fundings
#
#  id                        :bigint           not null, primary key
#  amount                    :integer
#  application_submitted_at  :datetime
#  approved_at               :datetime
#  coc_sent_at               :datetime
#  coc_signed_at             :datetime
#  denied_at                 :datetime
#  invoice_sent_at           :datetime
#  loan_docs_signed_at       :datetime
#  sent_to_collections_at    :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  finance_partner_id        :bigint           not null
#  project_id                :bigint           not null
#  sent_to_collections_by_id :bigint
#
# Indexes
#
#  index_fundings_on_finance_partner_id         (finance_partner_id)
#  index_fundings_on_project_id                 (project_id)
#  index_fundings_on_sent_to_collections_by_id  (sent_to_collections_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (finance_partner_id => finance_partners.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (sent_to_collections_by_id => users.id)
#
require "test_helper"

class FundingTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
