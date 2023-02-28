class FundingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_funding, only: [:show, :edit, :update, :destroy]
  before_action :set_project, only: [:new, :create, :edit, :update, :show]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /fundings
  def index
    all_fundings = Funding.all
    authorize! all_fundings, with: FundingPolicy

    @no_payments_made = all_fundings.no_payments
    @good_faith_only = all_fundings.good_faith
    @first_payment = all_fundings.first_payment
    # TODO: This should probably be paginated, since there will be a lot of them, and they will probably only care to see recent ones.
    @fully_funded = all_fundings.fully_funded
    @cancelled_and_overdue = all_fundings.cancelled_and_overdue
    @incomplete_install = all_fundings.incomplete_install
  end

  # GET /fundings/1 or /fundings/1.json
  def show
  end

  # GET /fundings/new
  def new
    @funding = @project.fundings.new
    authorize! @funding, with: FundingPolicy
  end

  # GET /fundings/1/edit
  def edit
  end

  # POST /fundings or /fundings.json
  def create
    @funding = @project.fundings.new(funding_params)
    authorize! @funding, with: FundingPolicy

    respond_to do |format|
      if @funding.save
        format.html { redirect_to @project, notice: "Funding was successfully created." }
        format.json { render :show, status: :created, location: @project }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @funding.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /fundings/1 or /fundings/1.json
  def update
    respond_to do |format|
      if @funding.update(funding_params)
        format.html { redirect_to project_funding_path(@project, @funding), notice: "Funding was successfully updated." }
        format.json { render :show, status: :ok, location: project_funding_path(@project, @funding) }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @funding.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /fundings/1 or /fundings/1.json
  def destroy
    @funding.destroy
    respond_to do |format|
      format.html { redirect_to fundings_url, notice: "Funding was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def authorize_user!
    authorize! @funding, with: FundingPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_funding
    @funding = Funding.find(params[:id])
  end

  def set_project
    @project = Project.find(params[:project_id])
  end

  # Only allow a list of trusted parameters through.
  def funding_params
    params.require(:funding).permit(:approved_at,
      :denied_at,
      :loan_docs_signed_at,
      :application_submitted_at,
      :amount,
      :coc_sent_at,
      :coc_signed_at,
      :invoice_sent_at,
      :project_id,
      :finance_partner_id,
      :funding_id,
      :sent_to_collections_at,
      :sent_to_collections_by)
  end
end
