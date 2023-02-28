class ProjectsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_project, only: [:show, :edit, :update, :destroy]
  before_action :set_nested_project, only: [:link_salesforce]
  before_action :set_proposal, only: :create
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /projects
  def index
    @installers = Project.select(:installer_id).where.not(installer_id: "").map(&:installer_id).uniq
    projects = authorized_scope(Project.all)
    projects = projects.created_this_year if params[:time_period].present?
    projects = projects.where(id: Project.ossrp_filled_projects) if params[:scope].present? && params[:scope] == "ossrp_fields"
    projects = projects.where(id: Project.installer_filters_ids(params[:project_stage])) if params[:project_stage].present?
    projects = projects.where(account_id: params[:team]) if params[:team].present?
    projects = projects.where(sold_by_id: params[:user]) if params[:user].present?
    projects = projects.sort_by_params(params[:sort], sort_direction)
    projects = projects.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction) if params[:q].present?
    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @projects.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @pagy, @projects = pagy(projects)

    authorize! @projects, with: ProjectPolicy
    @projects.load
  end

  def link_salesforce
  end

  # GET /projects/1
  def show
    @files = current_user.sales? ? {size: 30, count: 30} : {size: 300, count: 300}
    @dynamic_form = DynamicForm.find_by(use_case: "residential-project", model: "Project")
    # @form_response = set_form_response
    # @form_response = FormResponse.new(respondable: @project, dynamic_form: @dynamic_form)
    @feedables = @project.project_feeds.order(created_at: :desc)

    @appointment = @project.appointments.new(appointment_type: "service call", consult: @project.appointments.find_by(appointment_type: "consult"))
    # @type_of_appointment = @project.appointments.last.next_appointment_type.titleize

    # @events = Event.where(eventable: @project)
    # @notes = Note.where(notable: @project)
    @new_note = Note.new(notable: @project)
  end

  # GET /projects/new
  def new
    @project = Project.new
    authorize! @project, with: ProjectPolicy
  end

  # GET /projects/1/edit
  def edit
  end

  # POST /projects
  def create
    if @proposal.project.present?
      authorize! @proposal.project, with: ProjectPolicy
      redirect_to project_path(@proposal.project), alert: "Project already exists."
    elsif project_create_transaction
      redirect_to @project, notice: "Project was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /projects/1
  def update
    if @project.update(project_params)
      redirect_to @project, notice: "Project was successfully updated."
    elsif project_params.include?("salesforce_residential_project_id")
      redirect_to project_link_salesforce_path(@project)
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
        system_size: project_params[:system_size],
        solar_array_count: project_params[:solar_array_count],
        finance_partner_id: project_params[:fundings][:finance_partner_id],
        energy_efficiency_pack: project_params[:energy_efficiency_pack],
        installer_id: project_params[:installer_id],
        address: @proposal.address
      )
      # TODO: Had to add this since it was just saving on item out of them all
      Project::INSTALL_TYPES.map { |type| @project.send :"#{type}=", project_params[type] unless @project.install_types.key?(type) }

      @funding = @project.fundings.new(project_params["fundings"])
      authorize! @project, with: ProjectPolicy
      @consult = @proposal.appointment

      @project.appointments.new(
        # NOTE: A project is only created after a site audit appointment is completed,
        #       and an Install appointment always creates a project
        appointment_type: "racking install",
        start_at: project_params[:appointments][:start_at],
        created_by: current_user,
        account: @proposal.appointment.account,
        scheduled_with_id: project_params[:appointments][:scheduled_with_id],
        created_by_position_id: current_user.job_position_id,
        address: @proposal.address,
        consult: @consult
      )
      @proposal.project = @project
      @proposal.completion_state = "closed"
      @consult.project = @project
      @consult.scheduled_with_id = project_params[:appointments][:scheduled_with_id]

      @project.save!
      @funding.save!
      @proposal.save!
      @consult.save!(validate: false) # TODO: this is no bueno. Code smell for sure

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

  def set_nested_project
    @project = Project.find(params[:project_id])
  end

  def authorize_user!
    authorize! @project, with: ProjectPolicy
  end

  # Only allow a trusted parameter "white list" through.
  def project_params
    params.require(:project).permit(:installer_id, :finance_partner_id, :energy_efficiency_pack, :system_size, :solar_array_count, :address_id, :proposal_id, :salesforce_residential_project_id,
      *Project::INSTALL_TYPES,
      attachments: [],
      appointments: [:start_at, :scheduled_with_id, :appointment_type],
      fundings: [:finance_partner_id, :amount])
  end
end
