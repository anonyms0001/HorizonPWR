class TeamsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_contact, only: [:show]
  def index
    @pagy, @teams = pagy(Account.where(active: true).sort_by_params(params[:sort], sort_direction))
  end

  def show
  end

  private

  def set_contact
    @team = Account.find(params[:id])
  end
end
