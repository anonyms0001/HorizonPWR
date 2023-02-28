class FieldConfigsController < ApplicationController
  before_action :set_field_config, only: [:show, :edit, :update, :destroy]
  before_action :set_form_config, only: [:edit, :new]

  # GET /field_configs
  def index
    @pagy, @field_configs = pagy(FieldConfig.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @field_configs.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @field_configs.load
  end

  # GET /field_configs/1
  def show
  end

  # GET /field_configs/new
  def new
    @field_config = FieldConfig.new
  end

  # GET /field_configs/1/edit
  def edit

  end

  # POST /field_configs
  def create
    @form_config = FormConfig.find(params[:field_config][:form_config_id])
    @field_config = FieldConfig.new(field_config_params)

    if @field_config.save
      redirect_to @form_config, notice: "Field config was successfully created."
    else
      # render :new, status: :unprocessable_entity
      redirect_to @form_config, status: :unprocessable_entity #, notice: "Field config could not be saved."
    end
  end

  # PATCH/PUT /field_configs/1
  def update
    if @field_config.update(field_config_params)
      redirect_to @field_config, notice: "Field config was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /field_configs/1
  def destroy
    @field_config.destroy
    redirect_to field_configs_url, notice: "Field config was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_field_config
    @field_config = FieldConfig.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def field_config_params
    params.require(:field_config).permit(:form_config_id, :name, :label, :field_type, :position, :required, :repeatable, options: [])
  end

  def set_form_config
    @form_configs = FormConfig.where(active: true).pluck(:title, :id).sort
  end
end
