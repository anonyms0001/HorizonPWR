class ProjectsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_project, only: [:show, :edit, :update, :destroy]
  before_action :set_proposal, only: :create
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /projects
  def index
    @installers = Project.select(:installer_id).where.not(installer_id: "").map(&:installer_id).uniq
    @pagy, @projects = pagy(Project.sort_by_params(params[:sort], sort_direction))
    @pagy, @projects = pagy(Project.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction)) if params[:q].present?
    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @projects.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @projects
    @projects.load
  end

  # GET /projects/1
  def show
    @dynamic_form = DynamicForm.find_by(use_case: "residential-project", model: "Project")
    # @form_response = set_form_response
    # @form_response = FormResponse.new(respondable: @project, dynamic_form: @dynamic_form)
    @feedables = @project.project_feeds.order(created_at: :desc)

    # binding.pry
    # @events = Event.where(eventable: @project)
    # @notes = Note.where(notable: @project)
    @new_note = Note.new(notable: @project)
  end

  # GET /projects/new
  def new
    @project = Project.new
    authorize! @project
  end

  # GET /projects/1/edit
  def edit
  end

  # POST /projects
  def create
    allowed_to? :create?, with: ProjectPolicy
    if @proposal.project.present?
      redirect_to project_path(@proposal.project), alert: "Project already exists."
    elsif project_create_transaction
      # TODO: I don't think @project exists here
      redirect_to @project, notice: "Project was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /projects/1
  def update
    if @project.update(project_params)
      redirect_to @project, notice: "Project was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /projects/1
  def destroy
    @project.destroy
    redirect_to projects_url, notice: "Project was successfully destroyed."
  end

  private

  def project_create_transaction
    ActiveRecord::Base.transaction do
      @project = Project.new(
        finance_partner_id: project_params[:finance_partner_id],
        energy_efficiency_pack: project_params[:energy_efficiency_pack],
        battery: project_params[:battery],
        address: @proposal.address
      )
      @project.appointments.new(
        appointment_type: "site audit", # A project is only created by scheduling a site audit appointment, and a site audit appointment always creates a project
        date: project_params[:appointments][:date],
        created_by: current_user,
        account: @proposal.appointment.account,
        scheduled_with_id: project_params[:appointments][:scheduled_with_id],
        created_by_position_id: current_user.job_position_id,
        address: @proposal.address
      )
      @proposal.project = @project
      @proposal.completion_state = "closed"
      @consult = @proposal.appointment
      @consult.project = @project
      @consult.scheduled_with_id = project_params[:appointments][:scheduled_with_id]

      @project.save!
      @proposal.save!
      @consult.save!

      @event = current_user.events.new(action: "created", eventable: @project)
      ProjectFeed.create!(project_feedable: @event, project_id: @event.eventable_id)
      @event.save!
    end
  end

  def set_form_response
    FormResponse.find_by(respondable: @project, dynamic_form: @dynamic_form) ||
      FormResponse.new(respondable: @project, dynamic_form: @dynamic_form)
  end

  def set_proposal
    @proposal = Proposal.find(params[:project][:proposal_id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_project
    @project = Project.find(params[:id])
  end

  def authorize_user!
    authorize! @project
  end

  # Only allow a trusted parameter "white list" through.
  def project_params
    params.require(:project).permit(:installer_id, :finance_partner_id, :energy_efficiency_pack, :battery, :address_id, :proposal_id,
      attachments: [],
      appointments: [:date, :scheduled_with_id])
  end
end
