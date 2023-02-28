class DocumentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_document, only: [:show, :edit, :update, :destroy]
  before_action :set_user, only: [:index, :show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]

  # GET /documents
  def index
    @pagy, @documents = pagy(@user.documents.order(:name, created_at: :desc))
    # @document_types = Address.select(:document_type).where.not(document_type: "").map(&:document_type).uniq
    # @pagy, @documents = pagy(@user.document.sort_by_params(params[:sort], sort_direction))
    # @pagy, @documents = pagy(Address.search_by_state(params[:q])) if params[:q].present?

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @documents.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    authorize! @documents, with: DocumentPolicy unless current_user.id.to_s == params["user_id"]
    @documents.load
  end

  # GET /documents/1
  # def show
  # end

  # GET /documents/new
  def new
    @document = Document.new
    authorize! @document, with: DocumentPolicy
  end

  # GET /documents/1/edit
  def edit
  end

  # POST /documents
  def create
    @document = Document.new(document_params)
    authorize! @document, with: DocumentPolicy

    if @document.save
      redirect_to @document, notice: "Document was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /documents/1
  def update
    if @document.update(document_params)
      redirect_to :show, notice: "Document was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /documents/1
  def destroy
    @document.destroy
    redirect_to documents_url, notice: "Document was successfully destoryed."
  end

  private

  #
  # # Use callbacks to share common setup or constraints between actions.
  def set_document
    @document = Document.find(params[:id])
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  def authorize_user!
    authorize! @document, with: DocumentPolicy
  end

  # Only allow a trusted parameter "white list" through.
  def document_params
    params.require(:document).permit(:document, attachments: [])
  end
end
