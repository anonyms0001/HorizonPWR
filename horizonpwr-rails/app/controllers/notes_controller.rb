class NotesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_note, only: [:show, :edit, :update, :destroy, :unsubscribe_from_note, :subscribe_to_note, :send_user_mention_notification]
  after_action :send_user_mention_notification, only: [:create]
  after_action :set_thread_access, only: [:create]
  before_action :set_feedback, only: :toggle_subscription
  before_action :authorize_user!, except: [:new, :index, :create, :unsubscribe_from_note, :subscribe_to_note]

  # GET /notes
  def index
    @pagy, @notes = pagy(Note.sort_by_params(params[:sort], sort_direction))
    authorize! @notes, with: NotePolicy

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
    @note = Note.new(notable_type: params[:notable_type], notable_id: params[:notable_id])
    authorize! @note, with: NotePolicy
  end

  # GET /notes/1/edit
  def edit
  end

  # POST /notes
  def create
    @note = current_user.notes.new(note_params)

    # TODO: This should probably be a real transaction.
    if @note.save && create_feedable
      update_users_to_notify
      notify_users

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

  def unsubscribe_from_note
    # Remove ID from array
    @note.users_to_notify.delete(current_user.id)

    flash[:notice] = if @note.save
      "You have been unsubscribed from this thread."
    else
      "Could not unsubscribe you at this time. Please try again."
    end

    redirect_back(fallback_location: @note)
  end

  def subscribe_to_note
    # Add ID to array
    @note.users_to_notify << current_user.id

    flash[:notice] = if @note.save
      "You have been subscribed to this thread."
    else
      "Could not subscribe you at this time. Please try again."
    end

    redirect_back(fallback_location: @note)
  end

  private

  def set_feedback
    @feedback = Feedback.find(params[:feedback_id])
  end

  def update_users_to_notify
    users_to_notify = @note.parent_record.users_to_notify

    # Set empty array, if needed.
    users_to_notify = [] if users_to_notify.nil?

    # Add admins/developers if this is a Feedback
    users_to_notify << JobPosition.find_by(name: "Software Developer").users.pluck(:id)

    # Add the current user, if needed.
    users_to_notify << current_user.id unless users_to_notify.include?(current_user.id)

    # Flatten and remove duplicates
    @note.parent_record.update!(users_to_notify: users_to_notify.flatten.uniq)
  end

  def notify_users
    # Notify everyone except the person who created the Note
    users = User.where(id: (@note.parent_record.users_to_notify - [current_user.id]))
    users.each do |user|
      ReplyToNote.with(parent_record_id: @note.parent_record.id, parent_record_type: @note.parent_record.class).deliver_later(user)
    end
  end

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
    UserMentionNotification.with(notable: @note.notable, parent_record_id: @note.parent_record.id, parent_record_type: @note.parent_record.class).deliver(user_mentions) if @note.user_mention_exists?
  end

  def user_mentions
    @users ||= @note.user_mentions
  end

  def set_thread_access
    set_permission_for_mentioned_users
    set_owner_thread_access
  end

  def set_permission_for_mentioned_users
    if @note.user_mention_exists?
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
    # Todo: this should be refactored into a policy for notes rather than existing in this controller
    NoteUserPermission.create(note: note.parent_record, user: user)
  end

  def authorize_user!
    authorize! @note, with: NotePolicy
  end
end
