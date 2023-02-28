class ErrorsController < ApplicationController
  def not_found
    Honeybadger.notify("404")
    render status: 404
  end

  def internal_server_error
    Honeybadger.notify("500")
    render status: 500
  end
end
