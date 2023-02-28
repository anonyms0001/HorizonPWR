class Users::RegistrationsController < Devise::RegistrationsController
  invisible_captcha only: :create

  protected

  def build_resource(hash = {})
    @applicant = Applicant.find_by(secure_public_id: params[:applicant] || cookies[:applicant_id])
    if @applicant.present?
      cookies[:applicant_id] = @applicant.secure_public_id
      @applicant.status = "onboarding"
      @applicant.save(validate: false)
      hash = {
        "name" => @applicant.name,
        "email" => @applicant.default_email,
        "phone" => @applicant.phone,
        "start_date" => @applicant.start_date,
        "canvass_user_id" => @applicant.canvass_user_id
      }.merge(hash)
    end
    self.resource = resource_class.new_with_session(hash, session)
    resource.job_position = @applicant.job_position if @applicant.present?
    resource.account_users.build(account: @applicant.account, roles: {member: true}) if @applicant&.account_id&.present?

    # Jumpstart: Skip email confirmation on registration.
    #   Require confirmation when user changes their email only
    resource.skip_confirmation!

    # Registering to accept an invitation should display the invitation on sign up
    if params[:invite] && (invite = AccountInvitation.find_by(token: params[:invite]))
      @account_invitation = invite
      resource.skip_default_account = true

      # Build and display account fields in registration form if enabled
    elsif Jumpstart.config.register_with_account?
      account = resource.owned_accounts.first
      account ||= resource.owned_accounts.new
      account.account_users.new(user: resource, admin: true)
    end
  end

  def update_resource(resource, params)
    # Jumpstart: Allow user to edit their profile without password
    resource.update_without_password(params)
  end

  def sign_up(resource_name, resource)
    sign_in(resource_name, resource)
    # cookies.delete(:applicant_id)
    # We can have this, but maybe it's good to not have it.
    # That way they have to clear their cookies to get around it.

    # If user registered through an invitation, automatically accept it after signing in
    if @account_invitation
      @account_invitation.accept!(current_user)

      # Clear redirect to account invitation since it's already been accepted
      stored_location_for(:user)
    end
  end
end
