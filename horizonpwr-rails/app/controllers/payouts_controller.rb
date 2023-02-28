class PayoutsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_payout, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]
  before_action :update_payout_line_items, only: [:update]

  # GET /payouts
  def index
    params[:sort] ||= "pay_date"
    params[:direction] ||= "asc"

    payouts = Payout.where("payouts.pay_date > ?", Date.today)
    payouts = Payout.where(pay_date: Date.today.at_beginning_of_week.strftime..Date.today.at_end_of_week.strftime) if params[:period].present? && params[:period] == "current_week"
    payouts = Payout.all if params[:filter].present? && params[:filter] == "all"
    payouts = Payout.where(status: params[:filter]) if params[:filter].present? && params[:filter] != "all"
    payouts = Payout.search_by_params(params[:q]) if params[:q].present?
    @pagy, @payouts = pagy(authorized_scope(payouts.sort_by_params(params[:sort], sort_direction)))
    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @payouts.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @payouts, with: PayoutPolicy
    @payouts.load
  end

  # GET /payouts/1
  def show
    @payout_date_select_options = Payout.default_date_selectors
    @pagy, @payout_line_items = pagy(@payout.payout_line_items)
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

  def update_payout_line_items
    if params[:payout][:payout_line_items_attributes].present?
      params[:payout][:payout_line_items_attributes].values.each do |pli|
        user_id = @payout.user_id
        payout_line_item = PayoutLineItem.find(pli["id"].to_i)
        payout_id = Payout.find_or_create_by!(pay_date: pli["payout_id"], user_id: user_id).id
        payout_line_item.update!(payout_id: payout_id)
      end

      # NOTE: We must delete the PLI params before passing them to the update method because it will cause errors.
      #       This is because we have now modified the Payout IDs for any PLI's that have changed, so they no longer match
      #       what was passed in with the params.
      params[:payout].extract!(:payout_line_items_attributes)
    end
  end

  def authorize_user!
    authorize! @payout, with: PayoutPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_payout
    @payout = Payout.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def payout_params
    params.require(:payout).permit(:user_id, :pay_date, :pay_total, :status, :approved_by, :paid_by_id, :paid_at,
      payout_line_items_attributes: [:payout_id, :id])
  end
end
