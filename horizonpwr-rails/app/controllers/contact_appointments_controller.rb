class ContactAppointmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_contact_appointment, only: [:show, :edit, :update, :destroy]

  # GET /contact_appointments
  def index
    @pagy, @contact_appointments = pagy(ContactAppointment.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @contact_appointments.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @contact_appointments.load
  end

  # GET /contact_appointments/1
  def show
  end

  # GET /contact_appointments/new
  def new
    @contact_appointment = ContactAppointment.new
  end

  # GET /contact_appointments/1/edit
  def edit
  end

  # POST /contact_appointments
  def create
    @contact_appointment = ContactAppointment.new(contact_appointment_params)

    if @contact_appointment.save
      redirect_to @contact_appointment, notice: "Contact appointment was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /contact_appointments/1
  def update
    if @contact_appointment.update(contact_appointment_params)
      redirect_to @contact_appointment, notice: "Contact appointment was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /contact_appointments/1
  def destroy
    @contact_appointment.destroy
    redirect_to contact_appointments_url, notice: "Contact appointment was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_contact_appointment
    @contact_appointment = ContactAppointment.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def contact_appointment_params
    params.require(:contact_appointment).permit(:appointment_id, :contact_id, :project_id)
  end
end
