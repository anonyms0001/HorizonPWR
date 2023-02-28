class ProposalsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :quality_progress
  before_action :authenticate_user!
  before_action :set_proposal, only: [:show, :edit, :update, :destroy]
  # NOTE: When adding new methods, remember to add them to the exceptions below if
  #       they don't require authorization.
  before_action :set_nested_proposal, only: [:blocked, :unblocked, :back, :start_design, :end_design, :start_quality, :quality_progress, :unstart_quality, :quality_previous]
  before_action :authorize_user!, except: [:blocked, :unblocked, :start_design, :end_design, :start_quality, :quality_progress, :quality_previous, :index, :new, :create]
  # after_action :update, only: :proposal_notification
  before_action :proposal_notification, only: :update

  # GET /proposals
  def index
    proposals = Proposal.ordered_by_appointment_date
    @pagy, @proposals = pagy(proposals)
    @pagy, @proposals = pagy(proposals.where(completion_state: "new").sort_by_params(params[:sort], sort_direction)) unless request.query_string.present?
    @pagy, @proposals = pagy(proposals.where(completion_state: params[:completion_state]).sort_by_params(params[:sort], sort_direction)) if params[:completion_state].present?
    @pagy, @proposals = pagy(proposals.where(blocked: params[:blocked]).sort_by_params(params[:sort], sort_direction)) if params[:blocked].present?
    @pagy, @proposals = pagy(Proposal.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction)) if params[:q].present?
    @proposals.load
    authorize! @proposals
  end

  # GET /proposals/1
  def show
    @dynamic_form = DynamicForm.find_by(use_case: "residential-proposal", model: "Proposal")
  end

  # GET /proposals/new
  def new
    @proposal = Proposal.new
    authorize! @proposal
  end

  # GET /proposals/1/edit
  def edit
  end

  # POST /proposals
  def create
    @proposal = Proposal.new(proposal_params)
    authorize! @proposal

    if @proposal.save
      redirect_to @proposal, notice: "Proposal was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /proposals/1
  def update
    if @proposal.update(proposal_params)
      redirect_to proposal_path(@proposal), notice: "Proposal was successfully updated."
    else
      render :edit
    end
  end

  def back
    if @proposal.completion_state == "quality" && @proposal.quality_control_step.positive?
      @proposal.update(quality_control_step: 0)
      redirect_back(fallback_location: proposals_path, notice: "un-started 'quality check'")
    elsif @proposal.completion_state == "quality"
      @proposal.update(completion_state: "draw", quality_control_step: 0)
      redirect_back(fallback_location: proposals_path, notice: "Proposal moved to 'Drawing'")
    elsif @proposal.completion_state == "draw"
      @proposal.update(completion_state: "new")
      redirect_back(fallback_location: proposals_path, notice: "Proposal moved to 'New'")
    else
      redirect_back(fallback_location: proposals_path, alert: "This proposal has already been moved to #{@proposal.completion_state}")
    end
  end

  def blocked
    if !@proposal.blocked && @proposal.update(blocked: true)
      redirect_to edit_proposal_path(@proposal), alert: "Proposal Blocked"
    else
      redirect_back(fallback_location: proposals_path, alert: "This proposal has already been blocked.")
    end
  end

  def unblocked
    if @proposal.blocked && @proposal.update(blocked: false)
      redirect_to @proposal, notice: "Proposal Un-Blocked"
      # redirect_back(fallback_location: proposals_path, notice: "Un-Blocked #{@proposal.name}")
    else
      redirect_to @proposal, alert: "This proposal has already been unblocked."
    end
  end

  def start_design
    if @proposal.completion_state == "new" && @proposal.update(completion_state: "draw", design_by_id: current_user.id, design_started_at: Time.now)
      redirect_to @proposal, notice: "Proposal 'Design Started'"
    else
      redirect_back(fallback_location: proposals_path, alert: "The Design for this proposal has already been started by #{@proposal.design_by_name}")
    end
  end

  def end_design
    if @proposal.completion_state == "draw" && @proposal.update(completion_state: "quality", design_completed_at: Time.now, quality_control_step: 0)
      redirect_to proposals_path, notice: "#{@proposal.name} proposal 'Ready For QC'"
    else
      redirect_back(fallback_location: proposals_path, alert: "The Design for this proposal has already been finished.")
    end
  end

  def start_quality
    if @proposal.completion_state == "quality" && @proposal.update(quality_control_by_id: current_user.id, quality_control_started_at: Time.now, quality_control_step: 1)
      redirect_to @proposal, notice: "#{@proposal.name} proposal 'Quality Check' started"
    elsif @proposal.completion_state == "complete" && @proposal.update(completion_state: "quality", quality_control_step: 1)
      redirect_to @proposal
    elsif @proposal.completion_state == "ready for close" && @proposal.update(completion_state: "quality", quality_control_step: 1)
      redirect_to @proposal
    else
      redirect_back(fallback_location: proposals_path, alert: "This proposal is not ready for Quality Control")
    end
  end

  def quality_progress
    if @proposal.completion_state == "quality" && @proposal.quality_control_step > 0
      @proposal.update(quality_control_step: @proposal.quality_control_step + 1)
      if @proposal.quality_control_step == 9
        @proposal.update(quality_control_completed_at: Time.now, completion_state: "complete")
        CompletedProposal.with(proposal: @proposal).deliver_later(@proposal.appointment.scheduled_with_consultant)
      end
      redirect_to proposal_path(@proposal, anchor: "proposal-actions")
    else
      redirect_to proposal_path(@proposal, anchor: "proposal-actions"), alert: "Error"
    end
  end

  def quality_previous
    if @proposal.completion_state == "quality" && @proposal.quality_control_step > 0
      @proposal.update(quality_control_step: @proposal.quality_control_step - 1)
      redirect_to proposal_path(@proposal, anchor: "proposal-actions")
    else
      redirect_to proposal_path(@proposal, anchor: "proposal-actions"), alert: "Error"
    end
  end

  # DELETE /proposals/1
  def destroy
    @proposal.destroy
    redirect_to proposals_url, notice: "Proposal was successfully destroyed."
  end

  private

  def proposal_notification
    if proposal_params["blocked_on"] != @proposal.blocked_on || proposal_params["reason_incomplete"] != @proposal.reason_incomplete
      BlockedProposal.with(proposal: @proposal, blocked_by: current_user).deliver_later(@proposal.appointment.created_by)
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_proposal
    @proposal = Proposal.find(params[:id])
  end

  def set_nested_proposal
    @proposal = Proposal.find(params[:proposal_id])
  end

  def authorize_user!
    authorize! @proposal
  end

  # Only allow a trusted parameter "white list" through.
  def proposal_params
    params.require(:proposal).permit(:blocked_on, :reason_incomplete, attachments: [])
  end
end
