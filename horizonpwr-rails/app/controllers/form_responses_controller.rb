class FormResponsesController < ApplicationController
  before_action :set_form_response, only: [:show, :edit, :update, :destroy]

  # GET /form_responses
  def index
    @pagy, @form_responses = pagy(FormResponse.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @form_responses.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @form_responses.load
  end

  # GET /form_responses/1
  def show
  end

  # GET /form_responses/new
  # These are created indirectly (as part of DynamicForms), so no one should access this page directly.
  # def new
  #   dynamic_form = DynamicForm.last
  #   form_config = dynamic_form.form_configs.first
  #   @form_response = FormResponse.new(respondable: Project.find(4), dynamic_form: dynamic_form, form_config: form_config)
  # end

  # GET /form_responses/1/edit
  # def edit
  # end

  # POST /form_responses
  def create
    @form_response = FormResponse.new(form_response_params)

    if @form_response.save
      redirect_to @form_response.respondable, notice: "Form response was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /form_responses/1
  def update
    if @form_response.update(form_response_params)
      redirect_to @form_response.respondable, notice: "Form response was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /form_responses/1
  def destroy
    @form_response.destroy
    redirect_to form_responses_url, notice: "Form response was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_form_response
    @form_response = FormResponse.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def form_response_params
    params.require(:form_response).permit(:respondable_id, :respondable_type, :dynamic_form_id, :form_config_id, field_responses_attributes: [*FormResponse::RESPONSES, :last_updated_by_id, :field_config_id, :response, :id])
  end
end
