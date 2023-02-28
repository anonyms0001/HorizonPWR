class PendingJobPositionsJob < ApplicationJob
  queue_as :default

  def perform(pending_job_id)
    pending_job_position = PendingJobPosition.find(pending_job_id)
    ActiveRecord::Base.transaction do
      pending_job_position.user.update(job_position_id: pending_job_position.job_position_id)
      pending_job_position.update(status: "completed")
    end
  end
end

# Scheduled according to https://crontab.guru/#1_0_*_*_SUN
# Sidekiq::Cron::Job.create(name: "Pending Job Positions - every Sunday", cron: "1 0 * * SUN", class: "PendingJobPositionsJob")
