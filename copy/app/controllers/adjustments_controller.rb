class AdjustmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_adjustment, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /adjustments
  def index
    @pagy, @adjustments = pagy(Adjustment.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @adjustments.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @adjustments
    @adjustments.load
  end

  # GET /adjustments/1
  def show
  end

  # GET /adjustments/new
  def new
    @adjustment = Adjustment.new
    authorize! @adjustment, with: AdjustmentPolicy
  end

  # GET /adjustments/1/edit
  def edit
  end

  # POST /adjustments
  def create
    @adjustment = Adjustment.new(adjustment_params)
    authorize! @adjustment, with: AdjustmentPolicy

    if @adjustment.save
      redirect_to @adjustment, notice: "Adjustment was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /adjustments/1
  def update
    if @adjustment.update(adjustment_params)
      redirect_to @adjustment, notice: "Adjustment was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /adjustments/1
  def destroy
    @adjustment.destroy
    redirect_to adjustments_url, notice: "Adjustment was successfully destroyed."
  end

  private

  def authorize_user!
    authorize! @adjustment, with: AdjustmentPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_adjustment
    @adjustment = Adjustment.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def adjustment_params
    params.require(:adjustment).permit(:amount)
  end
end
