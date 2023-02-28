class ContactAddressesController < ApplicationController
  before_action :set_project_contact_address, only: [:show, :edit, :update, :destroy]

  # GET /contact_addresses
  def index
    @pagy, @contact_addresses = pagy(ContactAddress.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @contact_addresses.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @contact_addresses.load
  end

  # GET /contact_addresses/1
  def show
  end

  # GET /contact_addresses/new
  def new
    @contact_address = ContactAddress.new
  end

  # GET /contact_addresses/1/edit
  def edit
  end

  # POST /contact_addresses
  def create
    @contact_address = ContactAddress.new(project_contact_address_params)

    if @contact_address.save
      redirect_to @contact_address, notice: "Project contact address was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /contact_addresses/1
  def update
    if @contact_address.update(project_contact_address_params)
      redirect_to @contact_address, notice: "Project contact address was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /contact_addresses/1
  def destroy
    @contact_address.destroy
    redirect_to contactAddresses_url, notice: "Project contact address was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_project_contact_address
    @contact_address = ContactAddress.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def project_contact_address_params
    params.require(:contact_address).permit(:primary_contact, :appointment_id, :contact_id, :project_id)
  end
end
