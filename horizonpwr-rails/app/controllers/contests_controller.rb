class ContestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_contest, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /contests
  def index
    @pagy, @contests = pagy(Contest.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @contests.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @contests.load
    authorize! @contests, with: ContestPolicy
  end

  # GET /contests/1 or /contests/1.json
  def show
  end

  # GET /contests/new
  def new
    @contest = Contest.new
    authorize! @contest, with: ContestPolicy
  end

  # GET /contests/1/edit
  def edit
  end

  # POST /contests or /contests.json
  def create
    @contest = Contest.new(contest_params)
    authorize! @contest, with: ContestPolicy

    respond_to do |format|
      if @contest.save
        format.html { redirect_to @contest, notice: "Contest was successfully created." }
        format.json { render :show, status: :created, location: @contest }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @contest.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /contests/1 or /contests/1.json
  def update
    respond_to do |format|
      if @contest.update(contest_params)
        format.html { redirect_to @contest, notice: "Contest was successfully updated." }
        format.json { render :show, status: :ok, location: @contest }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @contest.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /contests/1 or /contests/1.json
  def destroy
    @contest.destroy
    respond_to do |format|
      format.html { redirect_to contests_url, notice: "Contest was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def authorize_user!
    authorize! @contest, with: ContestPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_contest
    @contest = Contest.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def contest_params
    params.require(:contest).permit(:name, :start_at, :end_at)
  end
end
