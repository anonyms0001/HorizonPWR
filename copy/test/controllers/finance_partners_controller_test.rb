require "test_helper"

class FinancePartnersControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in users(:one) # Needs access to current_user
    @finance_partner = finance_partners(:one)
  end

  test "should get index" do
    get finance_partners_url
    assert_response :success
  end

  test "should get new" do
    get new_finance_partner_url
    assert_response :success
  end

  test "should create finance_partner" do
    assert_difference("FinancePartner.count") do
      post finance_partners_url, params: {finance_partner: {name: @finance_partner.name}}
    end

    assert_redirected_to finance_partner_url(FinancePartner.last)
  end

  test "should show finance_partner" do
    get finance_partner_url(@finance_partner)
    assert_response :success
  end

  test "should get edit" do
    get edit_finance_partner_url(@finance_partner)
    assert_response :success
  end

  test "should update finance_partner" do
    patch finance_partner_url(@finance_partner), params: {finance_partner: {name: @finance_partner.name}}
    assert_redirected_to finance_partner_url(@finance_partner)
  end

  test "should destroy finance_partner" do
    assert_difference("FinancePartner.count", -1) do
      delete finance_partner_url(@finance_partner)
    end

    assert_redirected_to finance_partners_url
  end
end
