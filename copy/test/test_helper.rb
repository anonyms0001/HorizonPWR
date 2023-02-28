ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "minitest/mock"
require File.expand_path("../../app/validators/options_validator", __FILE__)

# Uncomment to view full stack trace in tests
# Rails.backtrace_cleaner.remove_silencers!

require "sidekiq/testing" if defined?(Sidekiq)

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  def fake_event(name, format: :json)
    JSON.parse File.read("test/fixtures/files/#{name}.#{format}")
  end

  # Add more helper methods to be used by all tests here...
  def switch_account(account)
    patch "/accounts/#{account.id}/switch"
  end

  def json_response
    JSON.parse(response.body)
  end
end

class ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
end
