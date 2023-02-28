class DepartmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_department, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /departments
  def index
    @pagy, @departments = pagy(Department.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @departments.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @departments.load
    authorize! @departments, with: DepartmentPolicy
  end

  # GET /departments/1 or /departments/1.json
  def show
  end

  # GET /departments/new
  def new
    @department = Department.new
    authorize! @department, with: DepartmentPolicy
  end

  # GET /departments/1/edit
  def edit
  end

  # POST /departments or /departments.json
  def create
    @department = Department.new(department_params)
    authorize! @department, with: DepartmentPolicy

    respond_to do |format|
      if @department.save
        format.html { redirect_to @department, notice: "Department was successfully created." }
        format.json { render :show, status: :created, location: @department }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @department.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /departments/1 or /departments/1.json
  def update
    respond_to do |format|
      if @department.update(department_params)
        format.html { redirect_to @department, notice: "Department was successfully updated." }
        format.json { render :show, status: :ok, location: @department }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @department.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /departments/1 or /departments/1.json
  def destroy
    @department.destroy
    respond_to do |format|
      format.html { redirect_to departments_url, notice: "Department was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def authorize_user!
    authorize! @department, with: DepartmentPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_department
    @department = Department.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def department_params
    params.require(:department).permit(:name)
  end
end
