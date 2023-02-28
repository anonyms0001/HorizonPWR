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
  end

  test "moving a Payout Line Item to another Payout as Admin" do
    # NOTE: User doesn't have to be an Admin to do this, but being admin makes the "+/-" show up to help with tests.
    @user.admin = true
    @user.save
    @payout = payouts(:three)

    visit payout_url(@payout)
    assert_selector "a", text: "+/-", count: 1
    pay_date = Date.today.end_of_week + 5
    select((pay_date).strftime("%Y-%m-%d"), from: "payout_payout_line_items_attributes_0_payout_id")
    click_on "Save"
    assert_text "Payout was successfully updated."
    assert_selector "a", text: "+/-", count: 0
  end

  test "cannot move a Payout Line Item to another Payout without permissions" do
    logout
    @user = users(:two)
    login_as @user

    @payout = payouts(:three)
    visit payout_url(@payout)
    assert_text "You do not have enough permissions to access that."
  end

  test "updating a Payout" do
    visit payout_url(@payout)
    assert_text "Edit", count: 0
  end

  # NOTE: We are not destroying these.
  test "can not destroy a Payout" do
    visit edit_payout_url(@payout)
    assert has_no_field? "Delete", match: :first
  end
end
