class AppointmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_appointment, except: [:index, :new, :create]
  before_action :set_consult_appointment, only: [:new, :create]
  before_action :set_project, only: [:create], unless: -> { appointment_params[:appointment_type] == "follow up" }
  before_action :initialize_new_note, only: [:show]
  before_action :authorize_user!, except: [:index, :new, :create, :update_held]
  before_action :authorize_closers_only, only: [:update_held]

  # GET /appointments
  def index
    appointments = authorized_scope(Appointment.all).sort_by_params(params[:sort], sort_direction)
    # appointments = appointments.sort_by_params(params[:sort], sort_direction) if params[:sort].present?
    @appointment_types = appointments.map(&:appointment_type).uniq.sort
    appointments = appointments.where("created_by_id = ? OR scheduled_with_id = ?", params[:user], params[:user]) if params[:user].present?
    appointments = appointments.where(appointment_type: params[:appointment_type]) if params[:appointment_type].present?
    appointments = Appointment.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction) if params[:q].present?

    @pagy, @appointments = pagy(appointments.sort_by_params(params[:sort], sort_direction))
    authorize! @appointments
    @appointments.load
  end

  # GET /appointments/1
  def show
    if @appointment.held.nil? && @appointment.start_at > Time.now
      @user_is_closer = current_user.closer? && @appointment.scheduled_with_id != current_user.id
      @user_is_support = current_user.support?
      @closers = @appointment.account.closers - [@appointment.scheduled_with] if @user_is_support # @appointment.scheduled_with
    end
    initialize_new_note
  end

  # GET /appointments/new
  def new
    # @appointment = Appointment.new(appointment_type: "site audit", consult: @consult)
    # @appointment.contact_appointments.build
    # TODO: Refactor this to dynamically set other appointment types
    @appointment = if @appointment.appointment_type == "follow up"
      Appointment.new(appointment_type: "follow up", consult: @consult)
    else
      Appointment.new(appointment_type: "site audit", consult: @consult)
    end
    @appointment.contact_appointments.build
    authorize! @appointment
  end

  # GET /appointments/1/edit
  def edit
  end

  # POST /appointments
  def create
    @consult.scheduled_with_id = appointment_params[:scheduled_with_id] if appointment_params[:appointment_type] == "site audit"
    @appointment = @consult.appointments.new(
      appointment_params.merge(
        # appointment_type: 'site audit', # needs to dynamically update, so we pass this through on the form
        source: "pwrstation",
        created_by: current_user,
        account: @consult.account,
        project: @project,
        created_by_position_id: current_user.job_position_id,
        address: @consult.address
      )
    )
    authorize! @appointment, with: AppointmentPolicy

    if @appointment.save && @consult.save(validate: false)
      redirect_to @appointment.create_appointment_redirect_to, notice: "Appointment was successfully created."
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
    # @appointment.destroy # NOTE: We currently don't want this to be allowed.
    redirect_to appointments_url, notice: "Appointment cannot be deleted. Change the status to cancelled, instead"
  end

  def update_held
    message = if appointment_params.keys == ["held", "held_reason"]
      if @appointment.update(held: appointment_params["held"], held_by_id: current_user.id, held_at: Time.now, held_reason: appointment_params["held_reason"])
        "Appointment was successfully updated."
      else
        "Appointment was not successfully updated."
      end
    else
      "You must select a button and provide a reason."
    end

    # NOTE: This formats anything returned by the AppointmentHeldValidator.
    @appointment.errors.each do |error|
      attribute = error.attribute
      error = error.message
      message = "#{attribute.to_s.titleize.capitalize} #{error}"
    end

    redirect_to @appointment, notice: message
  end

  def selected_appointment
    respond_to do |format|
      format.html # show.html.erb
      format.json {
        render json:
                 {appointment_id: @appointment.id,
                  appointment_start: @appointment.start_at.strftime("%Y-%d-%m %H:%M:%S %Z"),
                  appointment_end: @appointment.end_at.strftime("%Y-%d-%m %H:%M:%S %Z"),
                  appointment_type: @appointment.appointment_type.titleize,
                  contact: @appointment.contacts.first,
                  energy_consultant: @appointment.scheduled_with,
                  field_marketer: @appointment.created_by,
                  team: @appointment.account}
      }
    end
  end

  def update_task_completion
    @appointment.task_completion[params[:task_completion_type].to_s] = true

    if @appointment.save
      redirect_to @appointment, notice: "#{params[:task_completion_type].capitalize} completed."
    else
      redirect_to @appointment, notice: "An error occurred. Please try again."
    end
  end

  def mark_failed
    @appointment.set_failed

    if @appointment.save
      redirect_to @appointment, notice: "Appointment marked as failed."
    else
      redirect_to @appointment, notice: "An error occurred. Please try again."
    end
  end

  private

  def initialize_new_note
    @new_note = @appointment.project.present? ? Note.new(notable: @appointment) : nil
  end

  def authorize_closers_only
    redirect_to @appointment, notice: "You are not allowed to hold this appointment." unless User.active.closers.include?(current_user)
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_appointment
    params[:id] = params[:appointment_id] if params[:appointment_id].present?
    @appointment = Appointment.find(params[:id])
  end

  def set_consult_appointment
    @consult = Appointment.find_by(id: appointment_params.dig(:consult_id))
  end

  def set_project
    @project = Project.find_by(id: appointment_params.dig(:project, :id))
  end

  def authorize_user!
    authorize! @appointment
  end

  # Only allow a trusted parameter "white list" through.
  def appointment_params
    params.require(:appointment).permit(:start_at,
      :id,
      :held,
      :held_reason,
      :appointment_type,
      :created_by_id,
      :scheduled_with_id,
      :consult_id,
      :appointment_status,
      # task_completion: %w[racking paneling electrical commissioning],
      project: [:installer_id, :id])
    # contact_attributes: [:account_id, :gender],
    # address_attributes: [:address] # , :project_attributes) #, :quality_sit, :appointment_type, :source, :appointment_status, :scheduled_with_id, :created_by_position_id, :address_id, contact_appointments_attributes: [:appointment_id, :contact_id, :address_id])
  end
end
