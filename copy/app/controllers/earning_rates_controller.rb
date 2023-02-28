class EarningRatesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_earning_rate, only: [:show, :edit, :update, :destroy]
  # GET /earning_rates
  def index
    @pagy, @earning_rates = pagy(EarningRate.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @earning_rates.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @earning_rates.load
  end

  # GET /earning_rates/1
  def show
  end

  # GET /earning_rates/new
  def new
    @earning_rate = EarningRate.new
  end

  # GET /earning_rates/1/edit
  def edit
  end

  # POST /earning_rates
  def create
    set_earning_type
    @earning_rate = EarningRate.new(earning_rate_params)

    if @earning_rate.save
      redirect_to @earning_type.earning_rate, notice: "Earning rate was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /earning_rates/1
  def update
    if @earning_rate.update(earning_rate_params)
      redirect_to @earning_rate, notice: "Earning rate was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /earning_rates/1
  def destroy
    @earning_rate.destroy
    redirect_to earning_rates_url, notice: "Earning rate was successfully destroyed."
  end

  private

  def set_earning_type
    @earning_type = EarningType.find(params[:earning_rate][:earning_type_id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_earning_rate
    @earning_rate = EarningRate.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def earning_rate_params
    params.require(:earning_rate).permit(:amount, :range_top, :range_bottom, :earning_type_id, :active, :job_position_id)
  end
end
