class ContactsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_contact, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /contacts
  def index
    @pagy, @contacts = pagy(Contact.sort_by_params(params[:sort], sort_direction))
    @pagy, @contacts = pagy(Contact.search_by_params(params[:q]).sort_by_params(params[:sort], sort_direction)) if params[:q].present?

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @contacts.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @contacts
    @contacts.load
  end

  # GET /contacts/1
  def show
  end

  # GET /contacts/new
  def new
    @contact = Contact.new
    authorize! @contact, with: ContactPolicy
  end

  # GET /contacts/1/edit
  def edit
  end

  # POST /contacts
  def create
    @contact = Contact.new(contact_params)
    authorize! @contact

    if @contact.save
      redirect_to @contact, notice: "Contact was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /contacts/1
  def update
    if @contact.update(contact_params)
      redirect_to @contact, notice: "Contact was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /contacts/1
  def destroy
    @contact.destroy
    redirect_to contacts_url, notice: "Contact was successfully destroyed."
  end

  private

  def authorize_user!
    authorize! @contact
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_contact
    @contact = Contact.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def contact_params
    params.require(:contact).permit(:first_name, :last_name, :email, :phone, account: [], user: [])
  end
end
