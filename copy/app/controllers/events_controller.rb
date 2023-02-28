class EventsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_event, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /events
  def index
    @pagy, @events = pagy(Event.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @events.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @events, with: EventPolicy
    @events.load
  end

  # GET /events/1
  def show
  end

  # GET /events/new
  def new
    @event = Event.new
    authorize! @event, with: EventPolicy
  end

  # GET /events/1/edit
  def edit
  end

  # POST /events
  def create
    @event = Event.new(event_params)
    authorize! @event, with: EventPolicy

    if @event.save
      redirect_to @event, notice: "Event was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/1
  def update
    if @event.update(event_params)
      redirect_to @event, notice: "Event was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /events/1
  def destroy
    @event.destroy
    redirect_to events_url, notice: "Event was successfully destroyed."
  end

  private

  def authorize_user!
    authorize! @event, with: EventPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_event
    @event = Event.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def event_params
    params.require(:event).permit(:user_id, :eventable_id, :eventable_type, :action)
  end
end
