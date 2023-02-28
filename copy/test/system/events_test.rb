require "application_system_test_case"

class EventsTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    sign_in users(:one)
    @event = events(:one)
  end

  test "visiting the index" do
    visit events_url
    assert_selector "h1", text: "Events"
  end

  test "creating a Event" do
    skip
    # We don't directly create events through a form, Events are created through triggers like creating a project.
    visit events_url
    click_on "New Event"

    fill_in "Account", with: @event.account_id
    fill_in "Action", with: @event.action
    fill_in "Eventable", with: @event.eventable_id
    fill_in "User", with: @event.user_id
    click_on "Create Event"

    assert_text "Event was successfully created"
    assert_selector "h1", text: "Events"
  end

  test "updating a Event" do
    visit event_url(@event)
    click_on "Edit", match: :first

    fill_in "Account", with: @event.account_id
    fill_in "Action", with: @event.action
    fill_in "Eventable", with: @event.eventable_id
    fill_in "User", with: @event.user_id
    click_on "Update Event"

    assert_text "Event was successfully updated"
    assert_selector "h1", text: "Events"
  end

  test "destroying a Event" do
    visit edit_event_url(@event)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Event was successfully destroyed"
  end
end
