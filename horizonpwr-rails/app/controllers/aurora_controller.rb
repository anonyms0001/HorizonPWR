class AuroraController < ApplicationController
  before_action :authenticate_user!
  before_action :set_proposal, except: [:add_to_aurora, :deactivate_aurora, :reactivate_aurora]
  before_action :set_user, only: [:add_to_aurora, :deactivate_aurora, :reactivate_aurora]

  def request_aurora_3dms
    if @proposal.aurora_project_id.present? && AuroraClient.new.request_3dms(@proposal, current_user)
      redirect_to @proposal, notice: "Aurora is working on the design"
    else
      redirect_to @proposal, notice: "Error"
    end
  end

  def create_aurora_project
    project_info = AuroraClient.new.create_project(@proposal, current_user)
    @proposal.update(aurora_project_id: project_info["project"]["id"])

    if @proposal.save
      redirect_back fallback_location: new_proposal_energy_consumption_path(@proposal.id), notice: "Aurora project has been created!"
    else
      redirect_to proposal_energy_consumption_path(@proposal.id), notice: "Project could not be saved."
    end
    # Response body:
    #  {
    #   "project": {
    #     "id": "3a5892ed-8a6c-45cf-a5b7-175bd34b941c",
    #     "external_provider_id": null,
    #     "name": null,
    #     "customer_salutation": null,
    #     "customer_first_name": null,
    #     "customer_last_name": null,
    #     "customer_address": "434 Brannan St, San Francisco, CA, USA",
    #     "customer_email": null,
    #     "customer_phone": null,
    #     "address": "434 Brannan St, San Francisco, CA, 94107",
    #     "latitude": 37.77958479999999,
    #     "longitude": -122.3954592,
    #     "project_type": "residential",
    #     "owner_id": null,
    #     "status": null
    #   }
    # }
  end

  def add_to_aurora
    existing_aurora_id = get_aurora_user_id_if_exists(@user)

    if existing_aurora_id.present?
      @user.update(aurora_user_id: existing_aurora_id, aurora_user_active: true)
    else
      # Invite user to Aurora, which generates an Aurora User ID.
      response = AuroraClient.new.invite_user(@user)
      aurora_user_id = response["user"]["id"]

      if aurora_user_id.present?
        @user.update(aurora_user_id: aurora_user_id, aurora_user_active: true)
        flash[:notice] = "An Aurora ID has been created for this user."
      else
        flash[:alert] = "Aurora ID could not be created."
      end
    end

    redirect_back fallback_location: edit_user_path(@user)
  end

  def deactivate_aurora
    response = AuroraClient.new.deactivate_user(@user)

    if response.is_a? Net::HTTPSuccess
      @user.update(aurora_user_active: false)
      flash[:notice] = "The Aurora ID for this user has been deactivated."
    else
      flash[:alert] = "Aurora ID could not be deactivated."
    end

    redirect_back fallback_location: edit_user_path(@user)
  end

  def reactivate_aurora
    response = AuroraClient.new.activate_user(@user)

    if response.is_a? Net::HTTPSuccess
      @user.update(aurora_user_active: true)
      flash[:notice] = "The Aurora ID for this user has been reactivated."
    else
      flash[:alert] = "Aurora ID could not be reactivated."
    end

    redirect_back fallback_location: edit_user_path(@user)
  end

  private

  def get_aurora_user_id_if_exists(user)
    response = AuroraClient.new.list_users
    array = response["users"].map { |r| r["id"] if r["email"] == user.email }
    array.reject(&:nil?)[0]
  end

  def set_proposal
    @proposal = Proposal.find(params[:proposal_id])
  end

  def set_user
    @user = User.find(params[:user_id])
  end
end
