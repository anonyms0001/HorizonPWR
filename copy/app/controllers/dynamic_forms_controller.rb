class DynamicFormsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_dynamic_form, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /dynamic_forms
  def index
    @pagy, @dynamic_forms = pagy(DynamicForm.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @dynamic_forms.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @dynamic_forms.load
  end

  # GET /dynamic_forms/1
  def show
  end

  # GET /dynamic_forms/new
  def new
    @dynamic_form = DynamicForm.new
    # authorize! @dynamic_form
  end

  # GET /dynamic_forms/1/edit
  def edit
  end

  # POST /dynamic_forms
  def create
    @dynamic_form = DynamicForm.new(dynamic_form_params)

    if @dynamic_form.save
      redirect_to @dynamic_form, notice: "Dynamic form was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /dynamic_forms/1
  def update
    if @dynamic_form.update(dynamic_form_params)
      redirect_to @dynamic_form, notice: "Dynamic form was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /dynamic_forms/1
  def destroy
    @dynamic_form.destroy
    redirect_to dynamic_forms_url, notice: "Dynamic form was successfully destroyed."
  end

  private

  def authorize_user!
    authorize! @dynamic_form
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_dynamic_form
    @dynamic_form = DynamicForm.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def dynamic_form_params
    params.require(:dynamic_form).permit(:model, :use_case, :sequential)
  end
end
