class AttachmentTagsController < ApplicationController
  before_action :set_attachment_tag, only: [:show, :edit, :update, :destroy]
  before_action :set_nested_model_info, only: [:index, :show, :edit, :update, :destroy]

  # GET /attachment_tags
  def index
    @attachment_tags = @nested_model.attachments # .sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @attachment_tags.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    # @attachment_tags.load
  end

  # GET /attachment_tags/1
  def show
  end

  # GET /attachment_tags/new
  def new
    @attachment_tag = ActiveStorage::Attachment.new
  end

  # GET /attachment_tags/1/edit
  def edit
  end

  # POST /attachment_tags
  def create
    @attachment_tag = ActiveStorage::Attachment.new(attachment_tag_params)

    if @attachment_tag.save
      redirect_to @attachment_tag, notice: "Attachment tag was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /attachment_tags/1
  def update
    if @attachment_tag.update(attachment_tag_params)
      redirect_to @attachment_tag, notice: "Attachment tag was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /attachment_tags/1
  def destroy
    @attachment_tag.destroy
    redirect_to attachment_tags_url, notice: "Attachment tag was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_attachment_tag
    @attachment_tag = ActiveStorage::Attachment.find(params[:id])
  end

  def set_nested_model_info
    if params[:project_id].present?
      @nested_model = Project.find(params[:project_id])
      @nested_model_title = "Project"
    elsif params[:proposal_id].present?
      @nested_model = Proposal.find(params[:proposal_id])
      @nested_model_title = "Proposal"
    end
  end

  # Only allow a trusted parameter "white list" through.
  def attachment_tag_params
    params.require(:attachment_tag).permit(:index, :show, :edit, :new)
  end
end
