require "application_system_test_case"

class EarningsTest < ApplicationSystemTestCase
  setup do
    @earning = earnings(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit earnings_url
    assert_selector "h1", text: "Earnings"
  end

  test "creating a Earning" do
    visit new_earning_url
    # click_on "New Earning"

    fill_in "Amount", with: @earning.amount
    fill_in "Downline earning", with: @earning.downline_earning_id
    fill_in "Payout rate variant", with: @earning.payout_rate_variant_id
    fill_in "Unit", with: @earning.unit
    click_on "Create Earning"

    assert_text "Earning was successfully created"
    assert_selector "h1", text: "Earnings"
  end

  test "updating a Earning" do
    visit earning_url(@earning)
    click_on "Edit", match: :first

    fill_in "Amount", with: @earning.amount
    fill_in "Downline earning", with: @earning.downline_earning_id
    fill_in "Payout rate variant", with: @earning.payout_rate_variant_id
    fill_in "Unit", with: @earning.unit
    click_on "Update Earning"

    assert_text "Earning was successfully updated"
    assert_selector "h1", text: "Earnings"
  end

  # NOTE: We are not destroying these.
  test "destroying a Earning" do
    visit edit_earning_url(@earning)
    assert has_no_field? "Delete", match: :first
  end
end
