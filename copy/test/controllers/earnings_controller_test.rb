require "test_helper"

class EarningsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @earning = earnings(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get earnings_url
    assert_response :success
  end

  test "should get new" do
    get new_earning_url
    assert_response :success
  end

  test "should create earning" do
    assert_difference("Earning.count") do
      post earnings_url, params: {earning: {amount: @earning.amount, downline_earning_id: @earning.downline_earning_id, payout_rate_variant_id: @earning.payout_rate_variant_id, unit: @earning.unit}}
    end

    assert_redirected_to earning_url(Earning.last)
  end

  test "should show earning" do
    get earning_url(@earning)
    assert_response :success
  end

  test "should get edit" do
    get edit_earning_url(@earning)
    assert_response :success
  end

  test "should update earning" do
    patch earning_url(@earning), params: {earning: {amount: @earning.amount, downline_earning_id: @earning.downline_earning_id, payout_rate_variant_id: @earning.payout_rate_variant_id, unit: @earning.unit}}
    assert_redirected_to earning_url(@earning)
  end

  test "should destroy earning" do
    assert_raises ActionController::RoutingError do
      delete earning_url(@earning)
    end
  end
end
