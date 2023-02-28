class ReferralsController < ApplicationController
  before_action :authenticate_user!, except: :create
  before_action :set_referral, only: [:show, :edit, :update, :destroy, :create_contact_address_appt]
  before_action :authorize_user!, except: [:index, :new, :create]

  layout :resolve_layout

  def resolve_layout
    action_name == "create" ? "lead_pages" : "application"
  end

  # GET /referrals
  def index
    @pagy, @referrals = pagy(Referral.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @referrals.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @referrals.load
    authorize! @referrals, with: ReferralPolicy
  end

  # GET /referrals/1 or /referrals/1.json
  def show
    if @referral.referral_contact_id.present?
      @contact = Contact.find(@referral.referral_contact_id)
      address = @contact.addresses.last
      @consultation = address.appointments.find_by(appointment_type: "consult")
    else
      user = @referral.user || current_user

      @contact = Contact.new(
        first_name: @referral.first_name,
        last_name: @referral.last_name,
        phone: @referral.phone,
        email: @referral.email,
        user_id: user.id,
        account_id: user.accounts.impersonal.last
      )

      @address = @contact.addresses.build

      @appointment = @address.appointments.build(
        created_by_id: user.id
      )
    end
  end

  # GET /referrals/new
  def new
    @referral = Referral.new
    authorize! @referral, with: ReferralPolicy
  end

  # GET /referrals/1/edit
  def edit
    @text_color = "text-black"
  end

  # POST /referrals or /referrals.json
  def create
    @contest_id = Contest.all.map { |i| i.id if i.active == "active" }.first

    @referral = Referral.new(referral_params.merge(contest_id: @contest_id))
    # authorize! @referral, with: ReferralPolicy
    respond_to do |format|
      if @referral.save
        format.html { redirect_back(fallback_location: "/contest", notice: "Your referral has been submitted. Thanks! We hope you win!") }
        format.json { redirect_to :show, status: :created, location: @referral }
      else
        format.html { render "static/contest", status: :unprocessable_entity }
        format.json { render json: @referral.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /referrals/1 or /referrals/1.json
  def update
    respond_to do |format|
      if @referral.update(referral_params)
        format.html { redirect_to @referral, notice: "Referral was successfully updated." }
        format.json { render :show, status: :ok, location: @referral }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @referral.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /referrals/1 or /referrals/1.json
  def destroy
    @referral.destroy
    respond_to do |format|
      format.html { redirect_to referrals_url, notice: "Referral was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def authorize_user!
    authorize! @referral, with: ReferralPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_referral
    @referral = Referral.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def referral_params
    params.require(:referral).permit(:referrer_contact_id, :referral_contact_id, :email, :phone, :first_name, :last_name, :contest_id, :status, :eligible, :referrer_first_name, :referrer_last_name, :referrer_address, :referrer_phone, :referrer_email, :user_id)
  end
end
