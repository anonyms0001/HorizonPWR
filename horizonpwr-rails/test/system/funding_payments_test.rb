require "application_system_test_case"

class FundingPaymentsTest < ApplicationSystemTestCase
  setup do
    @funding_payment = funding_payments(:one)
    @funding = @funding_payment.funding
    @project = @funding.project
    @user = users(:one)
    @user.permissions["can_manage_projects"] = true
    @user.permissions["can_manage_fundings"] = true
    @user.permissions["can_manage_funding_payments"] = true
    @user.save!
    login_as @user
  end

  test "creating a Funding payment" do
    visit new_project_funding_funding_payment_url(@project, @funding)
    # Fill in the Amount of "11999"
    fill_in "Amount", with: 11999

    # Select the Payment type called "second_payment" from the dropdown.
    select("second_payment", from: "funding_payment_payment_type")

    # Select the Received at date from the flatpickr.
    find("input.flatpickr-capybara-selector-received-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Click the button that says "Create Funding payment"
    click_on "Create Funding payment"

    assert_text "Funding payment was successfully created."
    # Verify that it says "Total: $12,000.00" somewhere on the page./
    assert_text "Total: $12,018.98"
  end

  test "updating a Funding payment amount" do
    visit edit_project_funding_funding_payment_url(@project, @funding, @funding_payment)
    fill_in "Amount", with: 50000
    click_on "Update Funding payment"

    assert_text "Funding payment was successfully updated"
  end

  test "updating a Funding payment type" do
    visit edit_project_funding_funding_payment_url(@project, @funding, @funding_payment)
    select("first_payment", from: "funding_payment_payment_type")
    click_on "Update Funding payment"

    assert_text "Funding payment was successfully updated"
  end

  test "updating a Funding payment date" do
    visit edit_project_funding_funding_payment_url(@project, @funding, @funding_payment)
    find("input.flatpickr-capybara-selector-received-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(12)").click # Choose the twelfth visible day
    find("h1").click # To close flatpickr
    click_on "Update Funding payment"

    assert_text "Funding payment was successfully updated"
  end
end
