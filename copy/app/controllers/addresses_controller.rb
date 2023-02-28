class AddressesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_address, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /addresses
  def index
    @address_types = Address.select(:address_type).where.not(address_type: "").map(&:address_type).uniq
    @pagy, @addresses = pagy(Address.sort_by_params(params[:sort], sort_direction))
    @pagy, @addresses = pagy(Address.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction)) if params[:q].present?
    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @addresses.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @addresses
    @addresses.load
  end

  # GET /addresses/1
  def show
  end

  # GET /addresses/new
  def new
    @address = Address.new
    authorize! @address, with: AddressPolicy
  end

  # GET /addresses/1/edit
  def edit
  end

  # POST /addresses
  def create
    @address = Address.new(address_params)
    authorize! @address, with: AddressPolicy

    if @address.save
      redirect_to @address, notice: "Address was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /addresses/1
  def update
    if @address.update(address_params)
      redirect_to @address, notice: "Address was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /addresses/1
  def destroy
    Honeybadger.notify("Someone tried to delete an address")
    redirect_to addresses_url, notice: "You should not delete Addresses"
  end

  private

  def authorize_user!
    authorize! @address, with: AddressPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_address
    @address = Address.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def address_params
    params.require(:address).permit(:address, :latitude, :longitude, :address_type)
  end
end
