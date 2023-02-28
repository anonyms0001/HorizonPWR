require "test_helper"

class EarningRatesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @earning_rate = earning_rates(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get earning_rates_url
    assert_response :success
  end

  test "should get new" do
    get new_earning_rate_url
    assert_response :success
  end

  test "should create earning_rate" do
    assert_difference("EarningRate.count") do
      post earning_rates_url, params: {earning_rate: {active: @earning_rate.active, amount: @earning_rate.amount, earning_type_id: @earning_rate.earning_type_id, job_position_id: @earning_rate.job_position_id, range_bottom: @earning_rate.range_bottom, range_top: @earning_rate.range_top}}
    end

    assert_redirected_to earning_rate_url(EarningRate.last)
  end

  test "should show earning_rate" do
    get earning_rate_url(@earning_rate)
    assert_response :success
  end

  test "should get edit" do
    get edit_earning_rate_url(@earning_rate)
    assert_response :success
  end

  test "should update earning_rate" do
    patch earning_rate_url(@earning_rate), params: {earning_rate: {active: @earning_rate.active, amount: @earning_rate.amount, earning_type_id: @earning_rate.earning_type_id, job_position_id: @earning_rate.job_position_id, range_bottom: @earning_rate.range_bottom, range_top: @earning_rate.range_top}}
    assert_redirected_to earning_rate_url(@earning_rate)
  end

  test "should destroy earning_rate" do
    assert_raises ActionController::RoutingError do
      delete earning_rate_url(@earning_rate)
    end
  end
end
