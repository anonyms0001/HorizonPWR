require "test_helper"

class IncomingWebhooksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @incoming_webhook = incoming_webhooks(:one)
  end

  test "should get index" do
    skip
    get incoming_webhooks_url
    assert_response :success
  end

  test "should get new" do
    skip
    get new_incoming_webhook_url
    assert_response :success
  end

  test "should create incoming_webhook" do
    skip
    assert_difference("IncomingWebhook.count") do
      post incoming_webhooks_url, params: {incoming_webhook: {event_type: @incoming_webhook.event_type, has_been_run: @incoming_webhook.has_been_run, payload: @incoming_webhook.payload}}
    end

    assert_redirected_to incoming_webhook_url(IncomingWebhook.last)
  end

  test "should show incoming_webhook" do
    skip
    get incoming_webhook_url(@incoming_webhook)
    assert_response :success
  end

  test "should get edit" do
    skip
    get edit_incoming_webhook_url(@incoming_webhook)
    assert_response :success
  end

  test "should update incoming_webhook" do
    skip
    patch incoming_webhook_url(@incoming_webhook), params: {incoming_webhook: {event_type: @incoming_webhook.event_type, has_been_run: @incoming_webhook.has_been_run, payload: @incoming_webhook.payload}}
    assert_redirected_to incoming_webhook_url(@incoming_webhook)
  end

  test "should destroy incoming_webhook" do
    skip
    assert_difference("IncomingWebhook.count", -1) do
      delete incoming_webhook_url(@incoming_webhook)
    end

    assert_redirected_to incoming_webhooks_url
  end
end
