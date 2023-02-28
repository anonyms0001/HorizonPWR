class AnnouncementsController < ApplicationController
  before_action :mark_as_read, if: :user_signed_in?
  before_action :authenticate_user!

  def index
    announcements = Announcement.all
    announcements = announcements.active unless current_user.developer?

    @pagy, @announcements = pagy(announcements.order(published_at: :desc))
  end

  private

  def mark_as_read
    current_user.update(announcements_read_at: Time.zone.now)
  end
end
