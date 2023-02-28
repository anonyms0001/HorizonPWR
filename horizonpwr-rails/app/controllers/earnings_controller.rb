class EarningsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_earning, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /earnings
  def index
    @pagy, @earnings = pagy(Earning.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @earnings.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @earnings, with: EarningPolicy
    @earnings.load
  end

  # GET /earnings/1
  def show
  end

  # GET /earnings/new
  def new
    @earning = Earning.new
    authorize! @earning, with: EarningPolicy
  end

  # GET /earnings/1/edit
  def edit
  end

  # POST /earnings
  def create
    @earning = Earning.new(earning_params)
    authorize! @earning, with: EarningPolicy

    if @earning.save
      redirect_to @earning, notice: "Earning was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /earnings/1
  def update
    if @earning.update(earning_params)
      redirect_to @earning, notice: "Earning was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /earnings/1
  def destroy
    @earning.destroy
    redirect_to earnings_url, notice: "Earning was successfully destroyed."
  end

  private

  def authorize_user!
    authorize! @earning, with: EarningPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_earning
    @earning = Earning.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def earning_params
    params.require(:earning).permit(:downline_earning_id, :payout_rate_variant_id, :amount, :unit, :address_id, :status)
  end
end
