class PayoutsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_payout, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /payouts
  def index
    @pagy, @payouts = pagy(authorized_scope(Payout.sort_by_params(params[:sort], sort_direction)))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @payouts.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @payouts
    @payouts.load
  end

  # GET /payouts/1
  def show
  end

  # GET /payouts/new
  def new
    @payout = Payout.new
    authorize! @payout, with: PayoutPolicy
  end

  # GET /payouts/1/edit
  def edit
  end

  # POST /payouts
  def create
    @payout = Payout.new(payout_params)
    authorize! @payout, with: PayoutPolicy

    if @payout.save
      redirect_to @payout, notice: "Payout was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /payouts/1
  def update
    if @payout.update(payout_params)
      redirect_to @payout, notice: "Payout was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /payouts/1
  def destroy
    @payout.destroy
    redirect_to payouts_url, notice: "Payout was successfully destroyed."
  end

  private

  def authorize_user!
    authorize! @payout, with: PayoutPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_payout
    @payout = Payout.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def payout_params
    params.require(:payout).permit(:user_id, :pay_date, :pay_total, :status, :approved_by, :paid_by_id, :paid_at)
  end
end
