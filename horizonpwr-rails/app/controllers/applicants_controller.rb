class ApplicantsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :invite
  before_action :authenticate_user!, except: [:new, :create]
  before_action :set_applicant, only: [:show, :edit, :update, :destroy]
  before_action :set_nested_applicant, only: [:invite]
  before_action :authorize_user!, except: [:index, :new, :create, :invite]

  # GET /applicants
  def index
    applicants = authorized_scope(Applicant.all)
    applicants = applicants.search_by_params(params[:q]) if params[:q].present?
    applicants = applicants.where("applicants.updated_at > ? ", 7.days.ago) unless params[:filter].present? || params[:q].present?
    @pagy, @applicants = pagy(applicants.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @applicants.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @applicants.load
    authorize! @applicants, with: ApplicantPolicy
  end

  # GET /applicants/1 or /applicants/1.json
  def show
    @links = @applicant.user&.document_links
  end

  # GET /applicants/new
  def new
    job_position_id = if params[:jp].present?
      params[:jp]
    elsif user_signed_in?
      JobPosition.find_by(name: "Field Marketer").id
    else
      JobPosition.find_by(name: "General Application").id
    end
    account = user_signed_in? ? current_user.accounts.impersonal.first : nil
    @applicant = Applicant.new(job_position_id: job_position_id, account: account, created_by: current_user)
  end

  # GET /applicants/1/edit
  def edit
  end

  # POST /applicants or /applicants.json
  def create
    @applicant = Applicant.new(applicant_params)
    @applicant.status = "invited" if @applicant.created_by_id.present?

    respond_to do |format|
      if @applicant.save
        if user_signed_in?
          format.html { redirect_to @applicant, notice: "Application was successfully sent" }
          ApplicantNotification.with(applicant: @applicant, applicants_manager: @applicant.created_by).deliver_later(@applicant.created_by)
        else
          format.html { redirect_to careers_path, notice: "Application was successfully sent" }
          # TODO: refactor the noticed way by passing a collection of users into the deliver later
          User.can_manage_applicants.active.each do |applicants_manager|
            jp = JobPosition.find(applicants_manager.job_position_id).name
            next unless jp == "Human Resources" || jp == "Software Developer"
            ApplicantNotification.with(applicant: @applicant, applicants_manager: applicants_manager).deliver_later(applicants_manager)
          end
        end
        format.json { render :show, status: :created, location: @applicant }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @applicant.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /applicants/1 or /applicants/1.json
  def update
    respond_to do |format|
      if @applicant.update(applicant_params)
        format.html { redirect_to @applicant, notice: "Applicant was successfully updated." }
        format.json { render :show, status: :ok, location: @applicant }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @applicant.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /applicants/1 or /applicants/1.json
  def destroy
    @applicant.destroy
    respond_to do |format|
      format.html { redirect_to applicants_url, notice: "Applicant was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def invite
    @applicant.notes.create!(body: "Applicant resent sign up link", user: current_user)
    if (@applicant.status = "new" && @applicant.update(status: "invited"))
      ApplicantMailer.with(applicant: @applicant).invite.deliver_later
      redirect_to applicant_path(@applicant), notice: "Sign Up Link Sent"
    elsif @applicant.status != "new"
      ApplicantMailer.with(applicant: @applicant).invite.deliver_later
      redirect_to applicant_path(@applicant), notice: "Sign Up Link Resent"
    else
      redirect_back(fallback_location: applicant_path(@applicant), alert: "Application invite error")
    end
  end

  private

  def authorize_user!
    authorize! @applicant, with: ApplicantPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_applicant
    @applicant = Applicant.find(params[:id])
  end

  def set_nested_applicant
    @applicant = Applicant.find(params[:applicant_id])
  end

  # Only allow a list of trusted parameters through.
  def applicant_params
    params.require(:applicant).permit(:first_name, :last_name, :middle_initial, :name, :email, :new_email, :phone, :user_id, :created_by_id, :start_date, :account_id, :previously_employed_here, :status, :job_position_id, attachments: [])
  end
end
