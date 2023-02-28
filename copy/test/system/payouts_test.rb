require "application_system_test_case"

class PayoutsTest < ApplicationSystemTestCase
  setup do
    @payout = payouts(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit payouts_url
    assert_selector "h1", text: "Payouts"
  end

  test "creating a Payout" do
    visit new_payout_url
    # click_on "New Payout"

    fill_in "Approved by", with: @payout.approved_by_id
    fill_in "Paid by", with: @payout.paid_by_id
    find("input.flatpickr-capybara-selector-pay-date").fill_in(with: @payout.pay_date)
    find("h3").click
    find("input.flatpickr-capybara-selector-paid-on").fill_in(with: @payout.paid_at)
    find("h3").click
    fill_in "Pay total", with: @payout.pay_total
    fill_in "Status", with: @payout.status
    fill_in "User", with: @payout.user_id
    click_on "Create Payout"

    assert_text "Payout was successfully created"
    # assert_selector "h1", text: "Payouts"
  end

  test "updating a Payout" do
    visit payout_url(@payout)
    # click_on "Edit", match: :first
    assert_text "Edit", count: 0

    # fill_in "Approved by", with: @payout.approved_by_id
    # fill_in "Paid by", with: @payout.paid_by_id
    # find("input.flatpickr-capybara-selector-paid-on").fill_in(with: @payout.paid_at)
    # find("h3").click
    # # fill_in "Paid on", with: @payout.paid_on
    # # fill_in "Pay date", with: @payout.pay_date
    # find("input.flatpickr-capybara-selector-pay-date").fill_in(with: @payout.pay_date)
    # find("h3").click
    # fill_in "Pay total", with: @payout.pay_total
    # fill_in "Status", with: @payout.status
    # fill_in "User", with: @payout.user_id
    # click_on "Update Payout"
    #
    # assert_text "Payout was successfully updated"
    # assert_selector "h1", text: "Payouts"
  end

  # NOTE: We are not destroying these.
  test "can not destroying a Payout" do
    visit edit_payout_url(@payout)
    assert has_no_field? "Delete", match: :first
  end
end
