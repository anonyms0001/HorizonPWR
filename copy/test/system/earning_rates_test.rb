require "application_system_test_case"

class EarningRatesTest < ApplicationSystemTestCase
  setup do
    @earning_rate = earning_rates(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit earning_rates_url
    assert_selector "h1", text: "Earning Rates"
  end

  test "creating a Earning rate" do
    visit new_earning_rate_url
    # click_on "New Earning Rate"

    check "Active" if @earning_rate.active
    fill_in "Amount", with: @earning_rate.amount
    fill_in "Earning type", with: @earning_rate.earning_type_id
    fill_in "Job position", with: @earning_rate.job_position_id
    fill_in "Range bottom", with: @earning_rate.range_bottom
    fill_in "Range top", with: @earning_rate.range_top
    click_on "Create Earning rate"

    assert_text "Earning rate was successfully created"
    assert_selector "h1", text: "Earning Rates"
  end

  test "updating a Earning rate" do
    visit earning_rate_url(@earning_rate)
    click_on "Edit", match: :first

    check "Active" if @earning_rate.active
    fill_in "Amount", with: @earning_rate.amount
    fill_in "Earning type", with: @earning_rate.earning_type_id
    fill_in "Job position", with: @earning_rate.job_position_id
    fill_in "Range bottom", with: @earning_rate.range_bottom
    fill_in "Range top", with: @earning_rate.range_top
    click_on "Update Earning rate"

    assert_text "Earning rate was successfully updated"
    assert_selector "h1", text: "Earning Rates"
  end

  # NOTE: We are not destroying these.
  test "destroying a Earning rate" do
    visit edit_earning_rate_url(@earning_rate)
    assert has_no_field? "Delete", match: :first
  end
end
