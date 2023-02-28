require "application_system_test_case"

class EarningTypesTest < ApplicationSystemTestCase
  setup do
    @earning_type = earning_types(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit earning_types_url
    assert_selector "h1", text: "Earning Types"
  end

  test "creating a Earning type" do
    visit new_earning_type_url
    # click_on "New Earning Type"

    fill_in "Display name", with: @earning_type.display_name
    fill_in "Name", with: @earning_type.name
    fill_in "Percent", with: @earning_type.percent
    check "Preferred financial option" if @earning_type.preferred_financial_option
    select("Manager", from: "earning_type_job_position_id")
    click_on "Create Earning type"

    assert_text "Earning type was successfully created"
  end

  test "updating a Earning type" do
    visit earning_type_url(@earning_type)
    click_on "Edit", match: :first

    fill_in "Display name", with: @earning_type.display_name
    fill_in "Name", with: @earning_type.name
    fill_in "Percent", with: @earning_type.percent
    check "Preferred financial option" if @earning_type.preferred_financial_option
    select("Manager", from: "earning_type_job_position_id")
    click_on "Update Earning type"

    assert_text "Earning type was successfully updated"
  end

  # NOTE: We are not destroying these.
  test "destroying a Earning type" do
    visit edit_earning_type_url(@earning_type)
    assert has_no_field? "Delete", match: :first
  end
end
