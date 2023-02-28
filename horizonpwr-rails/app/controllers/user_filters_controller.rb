class UserFiltersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user_filter, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /user_filters
  def index
    @pagy, @user_filters = pagy(UserFilter.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @user_filters.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @user_filters.load
    authorize! @user_filters, with: UserFilterPolicy
  end

  # GET /user_filters/1 or /user_filters/1.json
  def show
  end

  # # GET /user_filters/new
  # def new
  #   @user_filter = UserFilter.new
  #   authorize! @user_filter, with: UserFilterPolicy
  # end

  # # GET /user_filters/1/edit
  # def edit
  # end

  # POST /user_filters or /user_filters.json
  def create
    # @user_filter = UserFilter.new(user_filter_params)
    @user_filter = current_user.user_filters.new(user_filter_params)
    authorize! @user_filter, with: UserFilterPolicy

    respond_to do |format|
      if @user_filter.save
        format.html { redirect_to calendars_url, notice: "User filter was successfully created." }
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_filters/1 or /user_filters/1.json
  def update
    respond_to do |format|
      if @user_filter.update(user_filter_params)
        format.html { redirect_to calendars_url, notice: "User filter was successfully updated." }
      else
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_filters/1 or /user_filters/1.json
  def destroy
    @user_filter.destroy
    respond_to do |format|
      format.html { redirect_to calendars_url, notice: "This filter has been deleted." }
    end
  end

  private

  def authorize_user!
    authorize! @user_filter, with: UserFilterPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_user_filter
    @user_filter = UserFilter.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def user_filter_params
    params.require(:user_filter).permit(:name, :filter, :user_id)
  end
end
