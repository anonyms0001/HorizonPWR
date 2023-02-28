class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update]
  before_action :authorize_user!, except: [:index]
  before_action :require_active_current_user!

  def index
    @pagy, @users = pagy(User.all)
    @active_teams = Account.impersonal.where(active: true)
    @teams = Account.all
    @positions = User.new.positions
    # @pagy, @users = pagy(User.search_by_full_name(params[:q])) if params[:q].present?
    # @pagy, @users = pagy(User.search_by_team(params[:team])) if params[:team].present?
    # @pagy, @users = pagy(User.search_by_team(params[:position])) if params[:position].present?
    @pagy, @users = pagy(User.where(active: true)) if params[:scope].present? && params[:scope] == "active"
    @pagy, @users = pagy(User.where(active: false)) if params[:scope].present? && params[:scope] == "inactive"
    @pagy, @users = pagy(User.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction)) if params[:q].present?
    authorize! @users
  end

  def show
  end

  def update
    if @user.update(user_params)
      if request.referrer.include?("/documents")
        redirect_to user_documents_path(user_id: @user.id), notice: "Document was successfully added."
      else
        redirect_to @user, notice: "User was successfully updated."
      end
    else
      render :edit, notice: "Something went wrong"
    end
  end

  def edit
  end

  def destroy
    redirect_to root_path, alert: "You cannot delete a User."
  end

  private

  def authorize_user!
    authorize! @user
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def user_params
    params.require(:user).permit(:name, :active, :birth_date, :start_date, :end_date, :job_position_id, *User::PERMISSIONS, documents: [])
  end
end
