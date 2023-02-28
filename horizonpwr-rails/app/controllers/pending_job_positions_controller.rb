class PendingJobPositionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:index, :show, :edit, :update, :destroy]
  before_action :set_pending_job_position, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /pending_job_positions
  def index
    @pagy, @pending_job_positions = pagy(@user.pending_job_positions.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @pending_job_positions.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @pending_job_positions.load
    authorize! @pending_job_positions, with: PendingJobPositionPolicy
  end

  # GET /pending_job_positions/1 or /pending_job_positions/1.json
  def show
  end

  # GET /pending_job_positions/new
  def new
    @pending_job_position = PendingJobPosition.new
    authorize! @pending_job_position, with: PendingJobPositionPolicy
  end

  # GET /pending_job_positions/1/edit
  def edit
  end

  # POST /pending_job_positions or /pending_job_positions.json
  def create
    @pending_job_position = PendingJobPosition.new(pending_job_position_params)
    @pending_job_position.user_id = params[:user_id]
    @pending_job_position.created_by_id = current_user.id
    @pending_job_position.status = "approved"
    authorize! @pending_job_position, with: PendingJobPositionPolicy

    respond_to do |format|
      if @pending_job_position.save
        format.html { redirect_to user_pending_job_positions_path, notice: "Pending job position was successfully created." }
        format.json { render :show, status: :created, location: @pending_job_position }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @pending_job_position.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /pending_job_positions/1 or /pending_job_positions/1.json
  def update
    respond_to do |format|
      if @pending_job_position.update(pending_job_position_params)
        format.html { redirect_to user_pending_job_positions_path, notice: "Pending job position was successfully updated." }
        format.json { render :show, status: :ok, location: @pending_job_position }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @pending_job_position.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pending_job_positions/1 or /pending_job_positions/1.json
  def destroy
    @pending_job_position.destroy
    respond_to do |format|
      format.html { redirect_to user_pending_job_positions_url, notice: "Pending job position was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def set_date_select_info
    @min_date = Date.today
    @max_date = Date.today + 90.days
    @available_dates = (@min_date..@max_date).filter_map { |day| day if day.sunday? }
  end

  def authorize_user!
    authorize! @pending_job_position, with: PendingJobPositionPolicy
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_pending_job_position
    @pending_job_position = PendingJobPosition.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def pending_job_position_params
    params.require(:pending_job_position).permit(:status, :job_position_id, :user_id, :effective_at, :created_by_id)
  end
end
