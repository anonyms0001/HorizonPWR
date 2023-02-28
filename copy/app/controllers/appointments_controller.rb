class AppointmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_appointment, only: [:show, :edit, :update, :destroy]
  before_action :set_consult_appointment, :set_project, only: :create
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /appointments
  def index
    @pagy, @appointments = pagy(authorized_scope(Appointment.all).sort_by_params(params[:sort], sort_direction))
    @appointment_types = @appointments.map(&:appointment_type).uniq.sort
    @pagy, @appointments = pagy(@appointments.sort_by_params(params[:sort], sort_direction)) if params[:sort].present?
    @pagy, @appointments = pagy(@appointments.where(appointment_type: params[:appointment_type])) if params[:appointment_type].present?
    @pagy, @appointments = pagy(Appointment.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction)) if params[:q].present?
    authorize! @appointments
    @appointments.load
  end

  # GET /appointments/1
  def show
  end

  # GET /appointments/new
  def new
    @appointment = Appointment.new(appointment_type: "site audit")
    @appointment.contact_appointments.build
    authorize! @appointment
  end

  # GET /appointments/1/edit
  def edit
  end

  # POST /appointments
  def create
    @appointment = @project.appointments.new(
      appointment_params.merge(
        # appointment_type: 'site audit', # needs to dynamically update, so we pass this through on the form
        source: "pwrstation",
        created_by: current_user,
        account: @consult.account,
        scheduled_with: @consult.scheduled_with_consultant, # We expect the initial consultation id to be passed through on the form because we want to make sure that any future appointments are scheduled with the person that closed the deal.
        # project: @project,
        created_by_position_id: current_user.job_position_id,
        address: @consult.address
      )
    )
    authorize! @appointment, with: AppointmentPolicy

    if @appointment.save
      redirect_to @project, notice: "Appointment was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /appointments/1
  def update
    if @appointment.update(appointment_params)
      redirect_to @appointment, notice: "Appointment was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /appointments/1
  def destroy
    @appointment.destroy
    redirect_to appointments_url, notice: "Appointment was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_appointment
    @appointment = Appointment.find(params[:id])
  end

  def set_consult_appointment
    @consult = Appointment.find(params[:appointment][:consult_appointment_id])
  end

  def set_project
    @project = @consult.project || Project.new(address: @consult.address)
  end

  def authorize_user!
    authorize! @appointment
  end

  # Only allow a trusted parameter "white list" through.
  def appointment_params
    params.require(:appointment).permit(:date, :appointment_type, :created_by_id, :scheduled_with_id, :consult_appointment_id, :appointment_status) # , :project_attributes) #, :quality_sit, :appointment_type, :source, :appointment_status, :scheduled_with_id, :created_by_position_id, :address_id, contact_appointments_attributes: [:appointment_id, :contact_id, :address_id])
  end
end
