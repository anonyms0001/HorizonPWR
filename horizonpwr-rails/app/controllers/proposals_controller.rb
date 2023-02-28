class ProposalsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :quality_progress
  before_action :authenticate_user!
  before_action :set_proposal, only: [:show, :edit, :update, :destroy, :create_aurora_project]
  # NOTE: When adding new methods, remember to add them to the exceptions below if
  #       they don't require authorization.
  before_action :set_nested_proposal, only: [:blocked, :unblocked, :back, :start_design, :end_design, :start_quality, :quality_progress, :unstart_quality, :quality_previous, :validate_project]
  before_action :authorize_user!, except: [:blocked, :unblocked, :start_design, :end_design, :start_quality, :quality_progress, :quality_previous, :index, :new, :create, :validate_project]
  # after_action :update, only: :proposal_notification
  before_action :proposal_notification, only: :update

  # GET /proposals
  def index
    days = (params[:days] || 10).to_i
    due_today = Appointment.where("start_at > ? AND start_at < ?", Date.today.beginning_of_day, Date.today.end_of_day).map(&:id)
    appointments = authorized_scope(Appointment.where("start_at > ? AND start_at < ?", Date.today.beginning_of_day, (Date.today + days).end_of_day))&.map(&:id)
    blocked_due_today = Proposal.where(appointment: appointments).where(blocked: true, archived: false, blocked_on: "Duplicate Proposal")
    @blocked_due_today_size = Proposal.where(appointment: due_today).where(blocked: true, archived: false, blocked_on: "Duplicate Proposal").size

    # Temporary fix to help Sales Support
    unfiltered_proposals = Proposal.where(blocked: false, archived: false).includes(:design_by, :quality_control_by, appointment: [:contacts, :scheduled_with, :created_by, :address]).order("appointments.start_at ASC")
      .or(Proposal.where(archived: false, blocked: true, blocked_on: ["Needs Usage", "Needs Photos"]).includes(:design_by, :quality_control_by, appointment: [:contacts, :scheduled_with, :created_by, :address]).order("appointments.start_at ASC"))

    # Default Proposal scope for Sales
    # unfiltered_proposals = unfiltered_proposals.joins(:appointment).where("appointments.start_at > ? AND start_at < ?", Date.today.beginning_of_day, (Date.today + days).end_of_day) if User.sales.include?(current_user)
    # Default Proposal scope
    proposals = unfiltered_proposals.where(completion_state: "new").sort_by_params(params[:sort], sort_direction)
    # Filtered Proposal scopes
    proposals = unfiltered_proposals.where(completion_state: params[:completion_state]).ordered_by_appointment_date if params[:completion_state].present?
    proposals = Proposal.ordered_by_appointment_date.where(blocked: params[:blocked]) if params[:blocked].present?
    proposals = blocked_due_today.ordered_by_appointment_date if params[:blocked].present? && params[:days].present?
    # proposals = Proposal.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction) if params[:q].present?
    proposals = Proposal.search_by_params(params[:q]) if params[:q].present?

    @pagy, @proposals = pagy(authorized_scope(proposals))
    @proposals.load
    authorize! @proposals
  end

  # GET /proposals/1
  def show
    @files = current_user.sales? ? {size: 30, count: 30} : {size: 300, count: 300}
    @dynamic_form = DynamicForm.find_by(use_case: "residential-proposal", model: "Proposal")
    @appointment = if !@proposal.address.appointments.map(&:appointment_type).include?("site audit")
      Appointment.new(appointment_type: "site audit", account: @proposal.appointment.account, scheduled_with: @proposal.appointment.scheduled_with, consult: @proposal.appointment)
    else
      Appointment.new(appointment_type: "racking install", account: @proposal.appointment.account, scheduled_with: @proposal.appointment.scheduled_with, consult: @proposal.appointment)
    end
    @proposal.project ||= @proposal.build_project
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
    if !@proposal.blocked && @proposal.update(blocked: true, blocked_at: Time.now, blocked_by: current_user)
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
    if ["new", "pending aurora"].include?(@proposal.completion_state) && @proposal.update(completion_state: "draw", design_by_id: current_user.id, design_started_at: Time.now)
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
    elsif @proposal.completion_state == "ready for close call" && @proposal.update(completion_state: "quality", quality_control_step: 1)
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

  def create_aurora_project
    AuroraClient.new.create_project(@proposal, current_user)

    if @proposal.save
      redirect_back fallback_location: new_proposal_energy_consumption_path(@proposal.id), notice: "Aurora project has been created!"
    else
      redirect_to proposal_energy_consumption_path(@proposal.id), notice: "Project could not be saved."
    end
  end

  def validate_project
    project_id = proposal_params["aurora_project_id"].strip
    valid_project = AuroraClient.new.retrieve_project(project_id)
    if valid_project.present? && valid_project["project"]
      @proposal.update(aurora_project_id: project_id)
      consumption_profile = AuroraClient.new.retrieve_consumption(project_id)
      if consumption_profile.present? && consumption_profile.size > 0
        # @proposal.update(aurora_project_id: project_id)
        @consumption = EnergyConsumption.create(proposal_id: @proposal.id, data_source: "aurora", monthly_usage: consumption_profile.map(&:to_i))
        redirect_to edit_proposal_energy_consumption_path(@proposal, @proposal.energy_consumption), notice: "Aurora project validated & consumption retrieved"
      end
      if @proposal.save && !@consumption
        redirect_to new_proposal_energy_consumption_path(@proposal.id), notice: "Aurora project validated."
      end
    else
      redirect_to new_proposal_energy_consumption_path(@proposal.id), alert: "Project could not be found in Aurora."
    end
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
    authorize! @proposal, with: ProposalPolicy
  end

  # Only allow a trusted parameter "white list" through.
  def proposal_params
    params.require(:proposal).permit(:blocked_on, :reason_incomplete, :aurora_project_id, :completion_state, :blocked, attachments: [])
  end
end
