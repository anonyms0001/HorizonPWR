class NoteTagsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_note, only: [:create, :destroy]
  before_action :authorize_user!

  # POST /note_tags
  def create
    @note.tag_list.add(params[:tag])
    @note.save

    redirect_back(fallback_location: @note)
  end

  # DELETE /note_tags
  def destroy
    @note.tag_list.remove(params[:tag])
    @note.save

    redirect_back(fallback_location: @note)
  end

  private

  def authorize_user!
    authorize! @note, with: NotePolicy
  end

  def set_note
    @note = Note.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def note_tag_params
    params.require(:note_tag).permit(:tag, :id)
  end
end
