class UplineRelationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_upline_relation, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /upline_relations
  def index
    @pagy, @upline_relations = pagy(UplineRelation.sort_by_params(params[:sort] || "active", sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @upline_relations.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @upline_relations
    @upline_relations.load
  end

  # GET /upline_relations/1
  def show
  end

  # GET /upline_relations/new
  def new
    @upline_relation = UplineRelation.new
    authorize! @upline_relation, with: UplineRelationPolicy
  end

  # GET /upline_relations/1/edit
  def edit
  end

  # POST /upline_relations
  def create
    @upline_relation = UplineRelation.new(upline_relation_params)
    authorize! @upline_relation, with: UplineRelationPolicy
    @upline_relation.created_by = current_user

    if @upline_relation.save
      redirect_to @upline_relation, notice: "Upline relation was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /upline_relations/1
  def update
    if @upline_relation.update(upline_relation_params)
      redirect_to @upline_relation, notice: "Upline relation was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /upline_relations/1
  def destroy
    redirect_to upline_relations_url, notice: "We don't delete Upline relations."
  end

  private

  def authorize_user!
    authorize! @upline_relation, with: UplineRelationPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_upline_relation
    @upline_relation = UplineRelation.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def upline_relation_params
    params.require(:upline_relation).permit(:upline_id, :downline_id, :active)
  end
end
