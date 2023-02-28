class InstallerInvitesController < ApplicationController
  include ActionView::RecordIdentifier
  before_action :set_note, only: [:toggle]
  # TODO: This is a good controller separated out from the notes controller. The anchor link still isn't working, but it likely won't be a big deal because we are thinking we will come back and remove this controller in favor of action cable. It would be nice if removing an installer would force the installer's page to reload and lose access and vice versa.
  # POST /notes
  def toggle
    @note.toggle(:installer_invited)

    if @note.installer_invited == true && @note.save
      redirect_to polymorphic_path([@note.notable], anchor: dom_id(@note)), notice: "Installer has been invited to this note."
    elsif @note.installer_invited == false && @note.save
      redirect_to polymorphic_path([@note.notable], anchor: dom_id(@note)), notice: "Installer has been removed from this note."
    else
      redirect_to polymorphic_path([@note.notable], anchor: dom_id(@note)), notice: "Installer could not be invited. Please try again."
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_note
    @note = Note.find(params[:note_id])
  end
end
