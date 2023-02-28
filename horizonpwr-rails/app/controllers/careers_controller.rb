class CareersController < ApplicationController
  before_action :set_job_position, only: [:show, :edit, :update, :destroy]

  # GET /job_positions
  def index
    @pagy, @careers = pagy(JobPosition.currently_hiring.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @careers.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @careers.load
  end

  # GET /job_positions/1
  def show
    @users = @career.users.where(active: true).with_attached_avatar
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_job_position
    @career = JobPosition.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def job_position_params
    params.require(:job_position).permit(:name, :active)
  end
end
