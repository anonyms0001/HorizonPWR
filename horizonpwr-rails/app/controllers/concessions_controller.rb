class ConcessionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_concession, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /concessions
  def index
    concessions = Concession.all.sort_by_params(params[:sort], sort_direction)
    concessions = concessions.where(project_id: params[:project_id]) if params[:project_id].present?
    @pagy, @concessions = pagy(concessions)

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @concessions.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @concessions.load
    authorize! @concessions, with: ConcessionPolicy
  end

  # GET /concessions/1 or /concessions/1.json
  def show
  end

  # GET /concessions/new
  def new
    @concession = Concession.new(project_id: params[:project_id])
    authorize! @concession, with: ConcessionPolicy
  end

  # GET /concessions/1/edit
  def edit
  end

  # POST /concessions or /concessions.json
  def create
    @concession = Concession.new(concession_params)
    authorize! @concession, with: ConcessionPolicy

    respond_to do |format|
      if @concession.save
        format.html { redirect_to @concession, notice: "Concession was successfully created." }
        format.json { render :show, status: :created, location: @concession }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @concession.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /concessions/1 or /concessions/1.json
  def update
    respond_to do |format|
      if @concession.update(concession_params)
        format.html { redirect_to @concession, notice: "Concession was successfully updated." }
        format.json { render :show, status: :ok, location: @concession }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @concession.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /concessions/1 or /concessions/1.json
  def destroy
    @concession.destroy
    respond_to do |format|
      format.html { redirect_to concessions_url, notice: "Concession was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def authorize_user!
    authorize! @concession, with: ConcessionPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_concession
    @concession = Concession.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def concession_params
    params.require(:concession).permit(:amount, :project_id)
  end
end
