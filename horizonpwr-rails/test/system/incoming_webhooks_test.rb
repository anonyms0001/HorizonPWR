require "application_system_test_case"

class IncomingWebhooksTest < ApplicationSystemTestCase
  setup do
    @incoming_webhook = incoming_webhooks(:one)
  end

  test "visiting the index" do
    skip
    visit incoming_webhooks_url
    assert_selector "h1", text: "Incoming Webhooks"
  end

  test "creating a Incoming webhook" do
    skip
    visit incoming_webhooks_url
    click_on "New Incoming Webhook"

    fill_in "Event type", with: @incoming_webhook.event_type
    check "Has been run" if @incoming_webhook.has_been_run
    fill_in "Payload", with: @incoming_webhook.payload
    click_on "Create Incoming webhook"

    assert_text "Incoming webhook was successfully created"
  end

  test "updating a Incoming webhook" do
    skip
    visit incoming_webhook_url(@incoming_webhook)
    click_on "Edit", match: :first

    fill_in "Event type", with: @incoming_webhook.event_type
    check "Has been run" if @incoming_webhook.has_been_run
    fill_in "Payload", with: @incoming_webhook.payload
    click_on "Update Incoming webhook"

    assert_text "Incoming webhook was successfully updated"
  end

  test "destroying a Incoming webhook" do
    skip
    visit edit_incoming_webhook_url(@incoming_webhook)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Incoming webhook was successfully destroyed"
  end
end
