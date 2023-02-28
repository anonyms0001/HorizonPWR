class NotesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_note, only: [:show, :edit, :update, :destroy]
  after_action :send_user_mention_notification, only: [:create]
  after_action :set_thread_access, only: [:create]
  before_action :authorize_user!, except: [:index, :create]

  # GET /notes
  def index
    @pagy, @notes = pagy(Note.sort_by_params(params[:sort], sort_direction))
    authorize! @notes, to: :index?

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @notes.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @notes.load
  end

  # GET /notes/1
  def show
    @new_note = Note.new(notable: @note)
    @reply = Note.new(notable: @note)
    @replies = Note.where(notable: @note).order(created_at: :asc)
  end

  # GET /notes/new
  def new
    @note = Note.new
  end

  # GET /notes/1/edit
  def edit
  end

  # POST /notes
  def create
    @note = current_user.notes.new(note_params)

    if @note.save && create_feedable
      redirect_to @note.notable, notice: "Note was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /notes/1
  def update
    if @note.update(note_params)
      redirect_to @note.notable, notice: "Note was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /notes/1
  def destroy
    @notable = @note.notable
    @note.destroy
    redirect_to @notable, notice: "Note was successfully destroyed."
  end

  private

  def create_feedable
    if @note.notable_type == "Project"
      ProjectFeed.create!(project_feedable: @note, project_id: @note.notable_id)
    else
      true
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_note
    @note = Note.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def note_params
    params.require(:note).permit(:user_id, :installer_id, :body, :notable_id, :notable_type)
  end

  def send_user_mention_notification
    UserMentionNotification.with(note: @note).deliver(user_mentions) if user_mention_exists?
  end

  def user_mentions
    @users ||= @note.body.body.attachments.select { |a| a.attachable.instance_of?(User) }.map(&:attachable).uniq # TODO: refactor
  end

  def user_mention_exists?
    true if @note.body&.body&.attachments
  end

  def set_thread_access
    set_permission_for_mentioned_users
    set_owner_thread_access
  end

  def set_permission_for_mentioned_users
    if user_mention_exists?
      user_mentions.each do |user|
        set_note_thread_access(@note.parent_record, user)
      end
    end
  end

  def set_owner_thread_access
    if @note.is_parent_record?
      set_note_thread_access(@note, current_user)
    end
  end

  def set_note_thread_access(note, user)
    NoteUserPermission.create(note: note.parent_record, user: user)
  end

  def authorize_user!
    authorize! @note, with: NotePolicy
  end
end
