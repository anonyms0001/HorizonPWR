require "application_system_test_case"

class AdjustmentsTest < ApplicationSystemTestCase
  setup do
    @adjustment = adjustments(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit adjustments_url
    assert_selector "h1", text: "Adjustments"
  end

  test "creating a Adjustment" do
    visit new_adjustment_url
    # click_on "New Adjustment"

    fill_in "Amount", with: @adjustment.amount
    click_on "Create Adjustment"

    assert_text "Adjustment was successfully created"
    assert_selector "p", text: "Amount: #{@adjustment.amount}"
  end

  test "updating a Adjustment" do
    visit adjustment_url(@adjustment)
    click_on "Edit", match: :first

    fill_in "Amount", with: @adjustment.amount
    click_on "Update Adjustment"

    assert_text "Adjustment was successfully updated"
    assert_selector "p", text: "Amount: #{@adjustment.amount}"
  end

  test "destroying a Adjustment" do
    visit edit_adjustment_url(@adjustment)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Adjustment was successfully destroyed"
  end
end
