class FeedbacksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_feedback, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, only: [:edit, :update, :destroy]
  before_action :tag_cloud, only: :index

  # GET /feedbacks
  def index
    @pagy, @feedbacks = pagy(Feedback.filtered.order(votes_count: :desc).order(created_at: :desc))
    @pagy, @feedbacks = pagy(Feedback.order(votes_count: :desc).order(created_at: :desc)) if params[:filtered].present? && params[:filtered] == "all"
    @pagy, @feedbacks = pagy(@feedbacks.where(status: params[:status])) if params[:status].present?
    @pagy, @feedbacks = pagy(@feedbacks.tagged_with(params[:tag])) if params[:tag].present?
    @pagy, @feedbacks = pagy(Feedback.sort_by_params(params[:sort], sort_direction)) if params[:sort].present?
    @pagy, @feedbacks = pagy(Feedback.search_by_params(params[:q])) if params[:q].present?

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @feedbacks.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @feedbacks.load
  end

  # GET /feedbacks/1
  def show
  end

  def vote
    @feedback = Feedback.find(params[:feedback_id])
    @vote = Vote.find_by(feedback: @feedback, user: current_user)
    if @vote.present?
      @vote.destroy
    else
      # binding.pry
      @feedback.votes.create(user: current_user)
    end
    @feedback.save
    redirect_back fallback_location: @feedback
  end

  # GET /feedbacks/new
  def new
    @feedback = Feedback.new
    # @note = @feedback.build_note
  end

  # GET /feedbacks/1/edit
  def edit
  end

  # POST /feedbacks
  def create
    @feedback = current_user.feedbacks.new(feedback_params)
    # @note = @feedback.build_note(user: current_user)

    if @feedback.save && @feedback.votes.create(user: current_user)
      redirect_to @feedback, notice: "Feedback was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /feedbacks/1
  def update
    if @feedback.update(feedback_params)
      redirect_to @feedback, notice: "Feedback was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /feedbacks/1
  def destroy
    @feedback.destroy
    redirect_to feedbacks_url, notice: "Feedback was successfully destroyed."
  end

  def tag_cloud
    @tags = Feedback.tag_counts_on(:tags)
  end

  private

  def authorize_user!
    authorize! @feedback
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_feedback
    @feedback = Feedback.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def feedback_params
    params.require(:feedback).permit(:user_id, :status, :title, :upvotes, :tracker_id, :purpose, :tag_list, note_attributes: [:id, :notable_type, :notable_id, :body, :user_id])
    # params.require(:form_response).permit(:respondable_id, :respondable_type, :dynamic_form_id, :form_config_id, field_responses_attributes: [*FormResponse::RESPONSES, :last_updated_by_id, :field_config_id, :response, :id])
  end
end
