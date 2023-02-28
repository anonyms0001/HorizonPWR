class InstallersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_installer, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /installers
  def index
    @pagy, @installers = pagy(Installer.sort_by_params(params[:sort], sort_direction))
    @pagy, @installers = pagy(Installer.search_by_params(params[:q])) if params[:q].present?

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @installers.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @installers, with: InstallerPolicy
    @installers.load
  end

  # GET /installers/1
  def show
  end

  # GET /installers/new
  def new
    @installer = Installer.new
    authorize! @installer, with: InstallerPolicy
  end

  # GET /installers/1/edit
  def edit
  end

  # POST /installers
  def create
    @installer = Installer.new(installer_params)
    authorize! @installer, with: InstallerPolicy

    if @installer.save
      redirect_to @installer, notice: "Installer was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /installers/1
  def update
    if @installer.update(installer_params)
      redirect_to @installer, notice: "Installer was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /installers/1
  def destroy
    @installer.destroy
    redirect_to installers_url, notice: "Installer was successfully destroyed."
  end

  private

  def authorize_user!
    authorize! @installer, with: InstallerPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_installer
    @installer = Installer.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def installer_params
    params.require(:installer).permit(:name, :active)
  end
end
