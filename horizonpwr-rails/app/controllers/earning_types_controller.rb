class EarningTypesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_earning_type, only: [:show, :edit, :update, :destroy]
  # before_action :authorize_user!, except: [:index, :new, :create]

  # GET /earning_types
  def index
    @pagy, @earning_types = pagy(EarningType.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @earning_types.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @earning_types.load
  end

  # GET /earning_types/1
  def show
  end

  # GET /earning_types/new
  def new
    @earning_type = EarningType.new # (job_position_id: params[:job_position_id])
    @job_position = params[:job_position_id]
  end

  # GET /earning_types/1/edit
  def edit
  end

  # POST /earning_types
  def create
    @earning_type = EarningType.new(earning_type_params)

    if @earning_type.save
      redirect_to @earning_type, notice: "Earning type was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /earning_types/1
  def update
    if @earning_type.update(earning_type_params)
      redirect_to @earning_type, notice: "Earning type was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /earning_types/1
  def destroy
    @earning_type.destroy
    redirect_to earning_types_url, notice: "Earning type was successfully destroyed."
  end

  private

  def authorize_user!
    authorize! @earning_type, with: EarningTypePolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_earning_type
    @earning_type = EarningType.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def earning_type_params
    params.require(:earning_type).permit(:name, :display_name, :preferred_financial_option, :percent, :job_position_id, earning_rates_attributes: [:amount, :range_top, :range_bottom, :earning_type_id, :active])
  end
end
