class JobPositionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_job_position, only: [:show, :edit, :update, :destroy]

  # GET /job_positions
  def index
    @pagy, @job_positions = pagy(JobPosition.sort_by_params(params[:sort], sort_direction))
    @pagy, @job_positions = pagy(JobPosition.search_by_params(params[:q])) if params[:q].present?

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @job_positions.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @job_positions, with: JobPositionPolicy
    @job_positions.load
  end

  # GET /job_positions/1
  def show
    @users = @job_position.users.where(active: true).with_attached_avatar
  end

  # GET /job_positions/new
  def new
    @job_position = JobPosition.new
    authorize! @job_position, with: JobPositionPolicy
  end

  # GET /job_positions/1/edit
  def edit
  end

  # POST /job_positions
  def create
    @job_position = JobPosition.new(job_position_params)
    authorize! @job_position, with: JobPositionPolicy

    if @job_position.save
      redirect_to @job_position, notice: "Job position was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /job_positions/1
  def update
    if @job_position.update(job_position_params)
      redirect_to @job_position, notice: "Job position was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /job_positions/1
  def destroy
    @job_position.destroy
    redirect_to job_positions_url, notice: "Job position was successfully destroyed."
  end

  private

  def authorize_user!
    authorize! @job_position, with: JobPositionPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_job_position
    @job_position = JobPosition.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def job_position_params
    params.require(:job_position).permit(:name, :active)
  end
end
