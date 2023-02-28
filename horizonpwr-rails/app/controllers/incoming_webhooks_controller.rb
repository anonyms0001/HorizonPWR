class IncomingWebhooksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_incoming_webhook, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /incoming_webhooks
  def index
    @pagy, @incoming_webhooks = pagy(IncomingWebhook.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @incoming_webhooks.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @incoming_webhooks.load
    authorize! @incoming_webhooks, with: IncomingWebhookPolicy
  end

  # GET /incoming_webhooks/1 or /incoming_webhooks/1.json
  def show
  end

  # GET /incoming_webhooks/new
  def new
    @incoming_webhook = IncomingWebhook.new
    authorize! @incoming_webhook, with: IncomingWebhookPolicy
  end

  # GET /incoming_webhooks/1/edit
  def edit
  end

  # POST /incoming_webhooks or /incoming_webhooks.json
  def create
    @incoming_webhook = IncomingWebhook.new(incoming_webhook_params)
    authorize! @incoming_webhook, with: IncomingWebhookPolicy

    respond_to do |format|
      if @incoming_webhook.save
        format.html { redirect_to @incoming_webhook, notice: "Incoming webhook was successfully created." }
        format.json { render :show, status: :created, location: @incoming_webhook }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @incoming_webhook.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /incoming_webhooks/1 or /incoming_webhooks/1.json
  def update
    respond_to do |format|
      if @incoming_webhook.update(incoming_webhook_params)
        format.html { redirect_to @incoming_webhook, notice: "Incoming webhook was successfully updated." }
        format.json { render :show, status: :ok, location: @incoming_webhook }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @incoming_webhook.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /incoming_webhooks/1 or /incoming_webhooks/1.json
  def destroy
    @incoming_webhook.destroy
    respond_to do |format|
      format.html { redirect_to incoming_webhooks_url, notice: "Incoming webhook was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def authorize_user!
    authorize! @incoming_webhook, with: IncomingWebhookPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_incoming_webhook
    @incoming_webhook = IncomingWebhook.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def incoming_webhook_params
    params.require(:incoming_webhook).permit(:has_been_run, :payload, :event_type)
  end
end
