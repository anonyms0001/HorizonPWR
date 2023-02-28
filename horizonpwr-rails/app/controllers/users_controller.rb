class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update]
  before_action :authorize_user!, except: [:index, :onboarding_complete]
  before_action :require_active_current_user!, except: [:onboarding_complete]
  before_action :set_applicant, only: :onboard_user

  def index
    users = User.active
    users = User.all if allowed_to?(:manage?, User, with: UserPolicy)
    @active_teams = Account.impersonal.where(active: true)
    @teams = Account.all
    @positions = User.new.positions
    users = User.search_by_full_name(params[:q]) if params[:q].present?
    users = User.search_by_params(params[:team]) if params[:team].present?
    users = User.search_by_params(params[:position]) if params[:position].present?
    users = User.sales.active if params[:scope].present? && params[:scope] == "sales"
    users = User.sales_managers.active if params[:scope].present? && params[:scope] == "managers"
    users = User.active if params[:scope].present? && params[:scope] == "active"
    users = User.days_old(params[:days]) if params[:days].present?
    users = User.where(active: false) if params[:scope].present? && params[:scope] == "inactive"
    users = User.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction) if params[:q].present?
    @pagy, @users = pagy(users.sorted)
    authorize! @users
  end

  def show
    # TODO: Is this right? Users can have many PendingJobPositions.
    @pending_job_position = PendingJobPosition.find_by(user_id: @user.id)
  end

  def update
    @user.skip_reconfirmation!
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

  def onboarding_complete
    @user = User.find(params[:user_id])

    if !@user.onboarding_checklist_complete && @user.update(onboarding_checklist_complete: true)
      OnboardedUserNotification.with(user: @user).deliver_later(User.hr)
      redirect_to onboarding_path, notice: "HR has been notified that you are ready to move forward with onboarding"
    else
      redirect_to onboarding_path, notice: "HR has already been notified"
    end
  end

  def onboard_user
    # TODO: Should this be inside a transaction?
    # IDK what this is for. We do not create users from an applicant. We invite them to sign up. I think this is not used. Commenting it out instead of deleting so if it is used, nothing breaks.
    Honeybadger.notify("Unused method Onboard_user was called somehow")

    # new_user = create_user_account(
    #   @applicant.first_name,
    #   @applicant.last_name,
    #   generate_email(@applicant.first_name, @applicant.last_name),
    #   SecureRandom.base58(40),
    #   @applicant.job_position_id
    # )
    #
    # OnboardedUserNotification.with(user: new_user).deliver_later(new_user)
    #
    # redirect_back(fallback_location: applicants_path, notice: "Applicant has been onboarded!")
  end

  private

  def set_applicant
    @applicant = Applicant.find(params[:applicant_id])
  end

  def create_user_account(first_name, last_name, email, password, job_position)
    User.create!(
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      password_confirmation: password,
      terms_of_service: false,
      job_position_id: job_position
    )
  end

  def generate_email(first_name, last_name)
    first_name + "." + last_name + "@horizonpwr.com"
  end

  def authorize_user!
    authorize! @user
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def user_params
    params.require(:user).permit(:name, :active, :birth_date, :email, :personal_email, :phone, :start_date, :end_date, :onboarding_checklist_complete, :job_position_id, :canvass_user_id, *User::PERMISSIONS, documents: [])
  end
end
