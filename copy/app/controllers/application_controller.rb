class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  include SetCurrentRequestDetails
  include SetLocale
  include Jumpstart::Controller
  include Accounts::SubscriptionStatus
  include Users::NavbarNotifications
  include Users::Sudo
  include Users::TimeZone
  include Pagy::Backend
  include CurrentHelper
  include Sortable
  include DeviceFormat

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :masquerade_user!

  def active_user_signed_in?
    user_signed_in? && current_user.active
  end

  rescue_from ActionPolicy::Unauthorized do |ex|
    Honeybadger.notify("#{ex} in #{ex.policy} #{ex.rule}")
    redirect_to root_path, alert: I18n.t("must_have_permissions")
  end

  protected

  # To add extra fields to Devise registration, add the attribute names to `extra_keys`
  def configure_permitted_parameters
    extra_keys = [:avatar, :name, :time_zone, :preferred_language, :shirt_size, :shoe_size, :start_date, :birth_date, :personal_email, :phone, :end_reason]
    signup_keys = extra_keys + [:terms_of_service, :invite, owned_accounts_attributes: [:name]]
    devise_parameter_sanitizer.permit(:sign_up, keys: signup_keys)
    devise_parameter_sanitizer.permit(:account_update, keys: extra_keys)
    devise_parameter_sanitizer.permit(:accept_invitation, keys: extra_keys)
  end

  def after_sign_in_path_for(resource_or_scope)
    stored_location_for(resource_or_scope) || super
  end

  # Helper method for verifying authentication in a before_action, but redirecting to sign up instead of login
  def authenticate_user_with_sign_up!
    unless user_signed_in?
      store_location_for(:user, request.fullpath)
      redirect_to new_user_registration_path, alert: t("create_an_account_first")
    end
  end

  def require_current_account_admin
    unless current_account_admin?
      redirect_to root_path, alert: t("must_be_an_admin")
    end
  end

  def require_active_current_user!
    unless active_user_signed_in?
      redirect_to root_path, alert: "Your account must be activated first"
    end
  end
end
