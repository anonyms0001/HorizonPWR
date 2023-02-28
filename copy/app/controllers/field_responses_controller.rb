class FieldResponsesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_field_response, only: [:show, :edit, :update, :destroy]

  # GET /field_responses
  def index
    @pagy, @field_responses = pagy(FieldResponse.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @field_responses.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @field_responses.load
  end

  # GET /field_responses/1
  def show
  end

  # GET /field_responses/new
  def new
    @field_response = FieldResponse.new
  end

  # GET /field_responses/1/edit
  def edit
  end

  # POST /field_responses
  def create
    @field_response = FieldResponse.new(field_response_params)

    if @field_response.save
      redirect_to @field_response, notice: "Field response was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /field_responses/1
  def update
    if @field_response.update(field_response_params)
      redirect_to @field_response, notice: "Field response was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /field_responses/1
  def destroy
    @field_response.destroy
    redirect_to field_responses_url, notice: "Field response was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_field_response
    @field_response = FieldResponse.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def field_response_params
    params.require(:field_response).permit(:form_response_id, :field_config_id, :user_id, :text_response, :numeric_response, :boolean_response, :last_updated_by_id, [*FormResponse::RESPONSES])
  end
end
