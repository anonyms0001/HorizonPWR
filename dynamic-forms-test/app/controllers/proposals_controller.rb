class ProposalsController < ApplicationController
  before_action :set_proposal, only: [:show, :edit, :update, :destroy]

  # GET /proposals
  def index
    @pagy, @proposals = pagy(Proposal.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @proposals.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @chart_data = {
      datasets: [{
                   label: 'My First dataset',
                   backgroundColor: ['orange', '#e6e6e4'],
                   borderColor: '#ffffff',
                   data: [50, 50]
                 }]
    }

    @chart_options = {
      responsive: true,
      hover:{
        mode: nil
      },
      tooltips:{
        enabled: false
      },
      plugins: {
        legend: {
          display: false,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Chart.js Doughnut Chart'
        }
      }
    }

    @proposals.load
  end

  # GET /proposals/1
  def show
    @form_configs = FormConfig.where(active: true, model: 'Proposal').order(position: :asc)
  end

  # GET /proposals/new
  def new
    @proposal = Proposal.new
  end

  # GET /proposals/1/edit
  def edit
  end

  # POST /proposals
  def create
    @proposal = Proposal.new(proposal_params)

    if @proposal.save
      redirect_to @proposal, notice: "Proposal was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /proposals/1
  def update
    if @proposal.update(proposal_params)
      redirect_to @proposal, notice: "Proposal was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /proposals/1
  def destroy
    @proposal.destroy
    redirect_to proposals_url, notice: "Proposal was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_proposal
    @proposal = Proposal.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def proposal_params
    params.require(:proposal).permit(:name)
  end
end
