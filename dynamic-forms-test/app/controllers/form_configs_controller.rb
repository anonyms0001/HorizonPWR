class FormConfigsController < ApplicationController
  before_action :set_form_config, only: [:show, :edit, :update, :destroy]

  # GET /form_configs
  def index
    @pagy, @form_configs = pagy(FormConfig.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @form_configs.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @form_configs.load
  end

  # GET /form_configs/1
  def show
    @form_configs = FormConfig.where(active: true).pluck(:title, :id).sort
  end

  # GET /form_configs/new
  def new
    @form_config = FormConfig.new
  end

  # GET /form_configs/1/edit
  def edit
  end

  # POST /form_configs
  def create
    @form_config = FormConfig.new(form_config_params)

    if @form_config.save
      redirect_to @form_config, notice: "Form config was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /form_configs/1
  def update
    if @form_config.update(form_config_params)
      redirect_to @form_config, notice: "Form config was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /form_configs/1
  def destroy
    @form_config.destroy
    redirect_to form_configs_url, notice: "Form config was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_form_config
    @form_config = FormConfig.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def form_config_params
    params.require(:form_config).permit(:title, :active, :position, :model, :use_case)
  end
end
