class DashboardController < ApplicationController
  def show
    @accounts = Account.all
  end
end
