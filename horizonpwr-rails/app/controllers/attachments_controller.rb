class AttachmentsController < ApplicationController
  before_action :set_object_with_attachments, only: [:index, :destroy]
  before_action :set_attachments, only: [:index]
  before_action :set_attachment, only: [:destroy]

  # GET /attachment_tags
  def index
  end

  # GET /attachment_tags/new
  def new
    @attachment_tag = ActiveStorage::Attachment.new
  end

  # DELETE /attachment_tags/1
  def destroy
    @attachment.destroy
    redirect_back(fallback_location: request.referrer, notice: "Attachment was successfully removed.")
  end

  private

  def set_object_with_attachments
    if params[:project_id].present?
      @object = Project.find(params[:project_id])
    elsif params[:proposal_id].present?
      @object = Proposal.find(params[:proposal_id])
    end
  end

  def set_attachments
    @attachments = @object.attachments
  end

  def set_attachment
    @attachment = ActiveStorage::Attachment.find(params[:attachment_id])
  end

  # Only allow a trusted parameter "white list" through.
  def attachment_tag_params
    params.require(:attachment_tag).permit(:index, :show, :edit, :new)
  end
end
