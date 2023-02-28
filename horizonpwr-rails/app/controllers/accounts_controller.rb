class AccountsController < Accounts::BaseController
  before_action :authenticate_user!
  before_action :set_account, only: [:show, :edit, :update, :destroy, :switch]
  before_action :require_account_admin, only: [:edit, :update, :destroy]
  before_action :prevent_personal_account_deletion, only: [:destroy]
  before_action :require_active_current_user!
  before_action :authorize_user!, only: [:update, :edit]
  after_action :sync_canvass_team, only: [:create, :update]

  # GET /accounts
  def index
    accounts = Account.impersonal.active.order("name ASC")
    # accounts = Account.impersonal.order("active DESC, name ASC") if current_user.admin?
    @pagy, @accounts = pagy(accounts)
    authorize! @accounts
  end

  # GET /accounts/1
  def show
    @account_users = @account.account_users.with_active_user
    @account_users = @account.members_type_select("#{params[:member_type]}") if params[:member_type]
  end

  # GET /accounts/new
  def new
    @account = Account.new
    authorize! @account
  end

  # GET /accounts/1/edit
  def edit
  end

  # POST /accounts
  def create
    @account = Account.new(account_params.merge(owner: current_user))
    @account.account_users.new(user: current_user, admin: true)
    authorize! @account

    if @account.save
      # Add any after-create functionality here
      # ActsAsTenant.with_tenant(@account) do
      #   # Create default records here...
      # end

      # Fetch requests / pushState doesn't work between (sub)domains
      # so we'll just link to switch to the new account in the notice instead
      if request.format == :turbo_stream && Jumpstart::Multitenancy.subdomain? && @account.subdomain?
        redirect_to @account, notice: t(".created_and_switch_html", link: root_url(subdomain: @account.subdomain))
      else
        # Automatically switch to the new account on the next request
        flash[:notice] = t(".created")
        redirect_to @account
        # switch
      end
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /accounts/1
  def update
    if @account.update(account_params)
      redirect_to @account, notice: t(".updated")
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # Current account will not change until the next request
  def switch
    # Uncomment this if you would like to redirect to the custom domain when switching accounts.
    # This is not enabled by default because we can't guarantee the domain is configured properly.
    #
    # if Jumpstart::Multitenancy.domain? && @account.domain?
    #  redirect_to @account.domain

    if Jumpstart::Multitenancy.subdomain? && @account.subdomain?
      redirect_to root_url(subdomain: @account.subdomain)

    elsif Jumpstart::Multitenancy.path?
      redirect_to root_url(script_name: "/#{@account.id}")

    else
      session[:account_id] = @account.id
      redirect_to root_path
    end
  end

  private

  def sync_canvass_team
    CanvassClient.new.sync_teams
  end

  def authorize_user!
    authorize! @account
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_account
    # @account = current_user.accounts.find(params[:id])
    @account = Account.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def account_params
    attributes = [:name, :avatar, :active, :installer_id]
    attributes << :domain if Jumpstart::Multitenancy.domain?
    attributes << :subdomain if Jumpstart::Multitenancy.subdomain?
    params.require(:account).permit(*attributes)
  end

  def prevent_personal_account_deletion
    if @account.personal?
      redirect_to account_path(@account), alert: t(".personal.cannot_delete")
    end
  end
end
