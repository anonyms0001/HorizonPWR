# == Schema Information
#
# Table name: concessions
#
#  id         :bigint           not null, primary key
#  amount     :decimal(, )
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  project_id :bigint           not null
#
# Indexes
#
#  index_concessions_on_project_id  (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#
class Concession < ApplicationRecord
  belongs_to :project
  has_many :adjustments, as: :adjustable
  after_commit :create_adjustment

  def availableProjects
    Project.all
  end

  def create_adjustment
    project = self.project
    backend_earning = project.earnings.select { |earning| earning.earning_type.name == "backend" }
    @earning = backend_earning.first
    @adjustment = Adjustment.new(amount: (amount / 2), adjustable_type: "Concession", adjustable_id: id, pay_back: 1, description: "Project concession")
    @adjustment.save
    if @earning.present? && @earning.payout_line_item.present?
      payout = @earning.payout_line_item.payout
      payout_line_item = PayoutLineItem.new(payout: payout, itemable: @adjustment)
      payout_line_item.save
    end
  end
end
