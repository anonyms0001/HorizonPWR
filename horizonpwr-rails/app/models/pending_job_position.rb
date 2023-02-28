# == Schema Information
#
# Table name: pending_job_positions
#
#  id              :bigint           not null, primary key
#  effective_at    :date             not null
#  status          :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  created_by_id   :bigint           not null
#  job_position_id :bigint           not null
#  user_id         :bigint           not null
#
# Indexes
#
#  index_pending_job_positions_on_created_by_id    (created_by_id)
#  index_pending_job_positions_on_job_position_id  (job_position_id)
#  index_pending_job_positions_on_user_id          (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (job_position_id => job_positions.id)
#  fk_rails_...  (user_id => users.id)
#
class PendingJobPosition < ApplicationRecord
  belongs_to :job_position
  belongs_to :user
  belongs_to :created_by, class_name: "User", foreign_key: "created_by_id", optional: true

  def statuses
    # Pending:  Add later, as needed, such as if Users must sign legal agreements first.
    # Approved: This is the initial status. If an Earning is Pending, it should not be included in a Payout.
    # Complete: The status should change to Complete when everything is finalized/complete.
    %w[approved completed]
  end

  def self.available_dates
    min_date = Date.today
    max_date = Date.today + 90.days
    (min_date..max_date).filter_map { |day| day if day.sunday? }
  end

  def status_color
    status == "pending" ? "red" : "green"
  end
end
