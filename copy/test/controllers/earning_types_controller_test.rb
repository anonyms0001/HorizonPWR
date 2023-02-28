require "test_helper"

class EarningTypesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @earning_type = earning_types(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get earning_types_url
    assert_response :success
  end

  test "should get new" do
    get new_earning_type_url
    assert_response :success
  end

  test "should create earning_type" do
    assert_difference("EarningType.count") do
      post earning_types_url, params: {earning_type: {display_name: @earning_type.display_name, name: @earning_type.name, percent: @earning_type.percent, preferred_financial_option: @earning_type.preferred_financial_option}}
    end

    assert_redirected_to earning_type_url(EarningType.last)
  end

  test "should show earning_type" do
    get earning_type_url(@earning_type)
    assert_response :success
  end

  test "should get edit" do
    get edit_earning_type_url(@earning_type)
    assert_response :success
  end

  test "should update earning_type" do
    patch earning_type_url(@earning_type), params: {earning_type: {display_name: @earning_type.display_name, name: @earning_type.name, percent: @earning_type.percent, preferred_financial_option: @earning_type.preferred_financial_option}}
    assert_redirected_to earning_type_url(@earning_type)
  end

  test "should destroy earning_type" do
    assert_raises ActionController::RoutingError do
      delete earning_type_url(@earning_type)
    end
  end
end
