class TrackerSyncJob < ApplicationJob
  queue_as :low

  def perform(feedback_id)
    Honeybadger.context({feedback_id: feedback_id})
    PivotalTrackerClient.new.sync_story_progress(feedback_id)
  end
end
