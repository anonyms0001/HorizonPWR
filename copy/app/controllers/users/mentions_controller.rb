class Users::MentionsController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = User.where(active: true).search_by_full_name(params[:query]).with_attached_avatar

    respond_to do |format|
      format.json
    end
  end

  private

  # By default, we'll only show the users in the current account.
  # You may want to use User.all instead to allow mentioning all users.
  def searchable_users
    current_account.users
  end
end
