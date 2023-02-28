class FinancePartnersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_finance_partner, only: [:show, :edit, :update, :destroy]

  # GET /finance_partners
  def index
    @pagy, @finance_partners = pagy(FinancePartner.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @finance_partners.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @finance_partners.load
  end

  # GET /finance_partners/1
  def show
  end

  # GET /finance_partners/new
  def new
    @finance_partner = FinancePartner.new
  end

  # GET /finance_partners/1/edit
  def edit
  end

  # POST /finance_partners
  def create
    @finance_partner = FinancePartner.new(finance_partner_params)

    if @finance_partner.save
      redirect_to @finance_partner, notice: "Finance partner was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /finance_partners/1
  def update
    if @finance_partner.update(finance_partner_params)
      redirect_to @finance_partner, notice: "Finance partner was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /finance_partners/1
  def destroy
    @finance_partner.destroy
    redirect_to finance_partners_url, notice: "Finance partner was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_finance_partner
    @finance_partner = FinancePartner.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def finance_partner_params
    params.require(:finance_partner).permit(:name)
  end
end
