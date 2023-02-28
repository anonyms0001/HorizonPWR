require "application_system_test_case"

class AdjustmentsTest < ApplicationSystemTestCase
  setup do
    @earning = earnings(*:one)
    @adjustment = adjustments(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit earning_adjustments_url(@earning)
    assert_selector "h1", text: "Adjustments"
  end

  test "creating an Adjustment" do
    visit new_earning_adjustment_url(@earning)
    # click_on "New Adjustment"

    fill_in "Amount", with: @adjustment.amount
    find(:css, "trix-editor[id=adjustment_description]").set("MyText")

    click_on "Create Adjustment"

    assert_text "Adjustment was successfully created"
    assert_selector "p#adjustment_#{Adjustment.last.id}", text: "Adjustment"
  end

  test "updating an Adjustment" do
    visit earning_adjustment_url(@earning, @adjustment)
    click_on "Edit", match: :first

    fill_in "Amount", with: @adjustment.amount + 1
    click_on "Update Adjustment"

    assert_text "Adjustment was successfully updated"
    assert_selector "p#adjustment_amount", text: "Amount: #{@adjustment.amount + 1}"
  end

  test "destroying a Adjustment" do
    visit edit_earning_adjustment_url(@earning, @adjustment)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Adjustment was successfully destroyed"
  end
end
