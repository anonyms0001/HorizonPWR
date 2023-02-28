class PayoutRateVariantsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_payout_rate_variant, only: [:show, :edit, :update, :destroy]

  # GET /payout_rate_variants
  def index
    @pagy, @payout_rate_variants = pagy(PayoutRateVariant.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @payout_rate_variants.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @payout_rate_variants.load
  end

  # GET /payout_rate_variants/1
  def show
  end

  # GET /payout_rate_variants/new
  def new
    @payout_rate_variant = PayoutRateVariant.new
  end

  # GET /payout_rate_variants/1/edit
  def edit
  end

  # POST /payout_rate_variants
  def create
    @payout_rate_variant = PayoutRateVariant.new(payout_rate_variant_params)

    if @payout_rate_variant.save
      redirect_to @payout_rate_variant, notice: "Payout rate variant was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /payout_rate_variants/1
  def update
    if @payout_rate_variant.update(payout_rate_variant_params)
      redirect_to @payout_rate_variant, notice: "Payout rate variant was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /payout_rate_variants/1
  def destroy
    @payout_rate_variant.destroy
    redirect_to payout_rate_variants_url, notice: "Payout rate variant was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_payout_rate_variant
    @payout_rate_variant = PayoutRateVariant.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def payout_rate_variant_params
    params.require(:payout_rate_variant).permit(:payout_id, :earning_rate_id, :earning_type_id)
  end
end
