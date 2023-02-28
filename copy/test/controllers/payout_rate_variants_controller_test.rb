require "test_helper"

class PayoutRateVariantsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @payout_rate_variant = payout_rate_variants(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get payout_rate_variants_url
    assert_response :success
  end

  test "should get new" do
    get new_payout_rate_variant_url
    assert_response :success
  end

  test "should create payout_rate_variant" do
    assert_difference("PayoutRateVariant.count") do
      post payout_rate_variants_url, params: {payout_rate_variant: {earning_rate_id: @payout_rate_variant.earning_rate_id, earning_type_id: @payout_rate_variant.earning_type_id, payout_id: @payout_rate_variant.payout_id}}
    end

    assert_redirected_to payout_rate_variant_url(PayoutRateVariant.last)
  end

  test "should show payout_rate_variant" do
    get payout_rate_variant_url(@payout_rate_variant)
    assert_response :success
  end

  test "should get edit" do
    get edit_payout_rate_variant_url(@payout_rate_variant)
    assert_response :success
  end

  test "should update payout_rate_variant" do
    patch payout_rate_variant_url(@payout_rate_variant), params: {payout_rate_variant: {earning_rate_id: @payout_rate_variant.earning_rate_id, earning_type_id: @payout_rate_variant.earning_type_id, payout_id: @payout_rate_variant.payout_id}}
    assert_redirected_to payout_rate_variant_url(@payout_rate_variant)
  end

  test "should destroy payout_rate_variant" do
    assert_raises ActionController::RoutingError do
      delete payout_rate_variant_url(@payout_rate_variant)
    end
  end
end
