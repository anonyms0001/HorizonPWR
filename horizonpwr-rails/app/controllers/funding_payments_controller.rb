class FundingPaymentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_funding_payment, only: [:show, :edit, :update, :destroy]
  before_action :set_funding, only: [:new, :create, :edit, :update]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /funding_payments
  def index
    @pagy, @funding_payments = pagy(FundingPayment.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @funding_payments.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @funding_payments.load
    authorize! @funding_payments, with: FundingPaymentPolicy
  end

  # GET /funding_payments/1 or /funding_payments/1.json
  def show
  end

  # GET /funding_payments/new
  def new
    @funding_payment = @funding.funding_payments.new
    authorize! @funding_payment, with: FundingPaymentPolicy
  end

  # GET /funding_payments/1/edit
  def edit
  end

  # POST /funding_payments or /funding_payments.json
  def create
    @funding_payment = @funding.funding_payments.new(funding_payment_params)
    authorize! @funding_payment, with: FundingPaymentPolicy
    respond_to do |format|
      if @funding_payment.save
        format.html { redirect_to project_funding_path(@funding.project, @funding), notice: "Funding payment was successfully created." }
        format.json { render :show, status: :created, location: project_funding_path(@funding.project, @funding) }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @funding_payment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /funding_payments/1 or /funding_payments/1.json
  def update
    respond_to do |format|
      if @funding_payment.update(funding_payment_params)
        format.html { redirect_to project_funding_path(@funding.project, @funding), notice: "Funding payment was successfully updated." }
        format.json { render :show, status: :ok, location: project_funding_path(@funding.project, @funding) }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @funding_payment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /funding_payments/1 or /funding_payments/1.json
  def destroy
    funding = Funding.find(@funding_payment.funding_id)
    project = funding.project
    @funding_payment.destroy
    respond_to do |format|
      format.html { redirect_to project_funding_path(project, funding), notice: "Funding payment was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def authorize_user!
    authorize! @funding_payment, with: FundingPaymentPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_funding_payment
    @funding_payment = FundingPayment.find(params[:id])
  end

  def set_funding
    @funding = Funding.find(params[:funding_id])
  end

  # Only allow a list of trusted parameters through.
  def funding_payment_params
    params.require(:funding_payment).permit(:received_at, :amount, :funding_id, :payment_type)
  end
end
