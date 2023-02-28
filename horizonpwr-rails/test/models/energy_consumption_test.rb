# == Schema Information
#
# Table name: energy_consumptions
#
#  id            :bigint           not null, primary key
#  daily_usage   :text             default([])
#  data_source   :string
#  monthly_usage :text             default([])
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  created_by_id :bigint
#  proposal_id   :bigint           not null
#  updated_by_id :bigint
#
# Indexes
#
#  index_energy_consumptions_on_created_by_id  (created_by_id)
#  index_energy_consumptions_on_proposal_id    (proposal_id)
#  index_energy_consumptions_on_updated_by_id  (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (proposal_id => proposals.id)
#  fk_rails_...  (updated_by_id => users.id)
#
require "test_helper"

class EnergyConsumptionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
