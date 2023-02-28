require "application_system_test_case"

class EarningRatesTest < ApplicationSystemTestCase
  setup do
    @earning_rate = earning_rates(:one)
    @earning_type = @earning_rate.earning_type
    @user = users(:one)
    login_as @user
  end

  test "creating a Earning rate" do
    @user.permissions["can_manage_job_positions"] = true
    @user.permissions["can_manage_earning_types"] = true
    @user.save

    # # NOTE: new_earning_rate_url should not be accessed directly!
    visit url_for(job_positions(:one))

    click_on "Front End (frontend)"

    fill_in "Amount", with: @earning_rate.amount
    fill_in "Range bottom", with: @earning_rate.range_bottom
    fill_in "Range top", with: @earning_rate.range_top
    check "Active" if @earning_rate.active
    click_on "Create Earning rate"

    assert_text "Earning rate was successfully created"
  end

  test "updating a Earning rate" do
    visit earning_rate_url(@earning_rate)
    click_on "Edit", match: :first

    check "Active" if @earning_rate.active
    fill_in "Amount", with: @earning_rate.amount
    fill_in "Range bottom", with: @earning_rate.range_bottom
    fill_in "Range top", with: @earning_rate.range_top
    click_on "Update Earning rate"

    assert_text "Earning rate was successfully updated"
  end

  # NOTE: We are not destroying these.
  test "destroying a Earning rate" do
    visit edit_earning_rate_url(@earning_rate)
    assert has_no_field? "Delete", match: :first
  end
end
