class CalendarNotesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_calendar_note, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /calendar_notes
  def index
    @pagy, @calendar_notes = pagy(CalendarNote.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @calendar_notes.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @calendar_notes.load
    authorize! @calendar_notes, with: CalendarNotePolicy
  end

  # GET /calendar_notes/1 or /calendar_notes/1.json
  def show
  end

  # GET /calendar_notes/new
  def new
    @calendar_note = CalendarNote.new
    @note = @calendar_note.build_note
    authorize! @calendar_note, with: CalendarNotePolicy
  end

  # GET /calendar_notes/1/edit
  def edit
  end

  # POST /calendar_notes or /calendar_notes.json
  def create
    @calendar_note = CalendarNote.new(calendar_note_params.except(:calendar_view, :start_date))
    authorize! @calendar_note, with: CalendarNotePolicy

    respond_to do |format|
      if @calendar_note.save
        format.html { redirect_to calendars_path(calendar_view: calendar_note_params[:calendar_view], start_date: calendar_note_params[:start_date]), notice: "Calendar note was successfully created." }
        # format.json { render :show, status: :created, location: @calendar_note }
      else
        format.html { redirect_to calendars_url, alert: "Calendar note wasn't successfully created." }
        # format.json { render json: @calendar_note.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /calendar_notes/1 or /calendar_notes/1.json
  def update
    respond_to do |format|
      if @calendar_note.update(calendar_note_params.except(:calendar_view, :start_date))
        format.html { redirect_to calendars_path(calendar_view: calendar_note_params[:calendar_view], start_date: calendar_note_params[:start_date]), notice: "Calendar note was successfully updated." }
        # redirect_back(fallback_location: calendars_path, notice: "Calendar note was successfully updated.")
        # format.json { render :show, status: :ok, location: @calendar_note }
      else
        format.html { redirect_to calendars_url, alert: "Calendar note wasn't successfully updated." }
        # format.json { render json: @calendar_note.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /calendar_notes/1 or /calendar_notes/1.json
  def destroy
    @calendar_note.destroy
    respond_to do |format|
      format.html { redirect_to calendar_notes_url, notice: "Calendar note was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def authorize_user!
    authorize! @calendar_note, with: CalendarNotePolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_calendar_note
    @calendar_note = CalendarNote.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def calendar_note_params
    params.require(:calendar_note).permit(:global, :date, :active, :calendar_view, :start_date, note_attributes: [:id, :notable_type, :notable_id, :body, :user_id])
  end
end
