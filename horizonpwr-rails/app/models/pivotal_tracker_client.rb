class PivotalTrackerClient
  attr_reader :token, :project, :client
  include Rails.application.routes.url_helpers

  def initialize
    token = Rails.application.credentials.dig(:pivotal_tracker, :token)
    client = TrackerApi::Client.new(token: token)
    @project = client.project(Rails.application.credentials.dig(:pivotal_tracker, :project))
  end

  def create_story(feedback)
    if Rails.env.production? && !feedback.tracker_id.present?
      story = project.create_story(name: feedback.title)
      feedback.update(tracker_id: story[:id])
      url = feedback_url(feedback, host: "https://pwrstation-prod.horizonpwr.com")
      # feedback.note.body.body.to_s
      description = "### Why\n\n\n**As personaName**\n**I want **\n**So that **\n\n### Acceptance Criteria\n\n```gherkin\nScenario: \nGiven\nWhen\nThen\n```\n\n**Notes:**\n[Feedback Suggestion](#{url})" if feedback.purpose != "bug"
      description = "### Steps to reproduce\n1. \n2. \n3. \n\n### Expected\n\n\n### Actual\n\nNotes: \n[Feedback Bug](#{url})\n" if feedback.purpose == "bug"
      story.attributes = {
        name: feedback.title,
        description: description
      } # Update multiple story attributes
      # feedback.tag_list.each do |tag|
      #   story.add_label(tag) # Add a new label to an existing story
      # end
      story.add_label("+feedback")
      story.save
    end
  end

  def sync_story_progress(feedback_id)
    # https://www.cloudbees.com/blog/improving-rails-performance-better-background-jobs
    # PWRStation States: (new, planned, in_progress, complete, declined)
    # Tracker States: (accepted, delivered, finished, started, rejected, planned, unstarted, unscheduled)

    feedback = Feedback.find(feedback_id)
    if feedback.tracker_id.present?
      begin
        story = project.story(feedback.tracker_id)
        if story.present?
          case story.current_state
          when "unscheduled"
            feedback.status = "not_scheduled"
          when "planned"
            feedback.status = "planned"
          when "unstarted"
            feedback.status = "planned"
          when "started"
            feedback.status = "in_progress"
          when "accepted"
            feedback.status = "complete"
          when "delivered"
            feedback.status = "in_progress"
          when "finished"
            feedback.status = "in_progress"
          when "rejected"
            feedback.status = "in_progress"
          end
          # TODO: Might turn this on in the future
          # feedback.tag_list.each do |tag|
          #   story.add_label(tag) # Add a new label to an existing story
          # end

          story.add_label("+feedback")
          story.add_label("priority") if feedback.tag_list.include?("priority")
          story.add_label("sales support") if feedback.tag_list.include?("sales support")
          story.add_label("project_managers") if feedback.tag_list.include?("project_managers")
          story.save
        end
      rescue
      end

      feedback.save if feedback.changed?
    end
  end
end

# https://www.pivotaltracker.com/help/api/#Request_Authorization
