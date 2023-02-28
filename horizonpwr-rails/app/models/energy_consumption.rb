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
class EnergyConsumption < ApplicationRecord
  belongs_to :proposal
  belongs_to :updated_by, class_name: "User", foreign_key: "updated_by_id", optional: true
  belongs_to :created_by, class_name: "User", foreign_key: "created_by_id", optional: true

  serialize :monthly_usage, Array
  serialize :daily_usage, Array

  validates :monthly_usage, presence: true
  validates :data_source, presence: true
  validates :proposal_id, presence: true
end
