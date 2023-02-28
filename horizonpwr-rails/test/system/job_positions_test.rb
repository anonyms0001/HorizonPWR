require "application_system_test_case"

class JobPositionsTest < ApplicationSystemTestCase
  setup do
    @job_position = job_positions(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit job_positions_url
    assert_selector "a", text: "MyString"
  end

  test "visiting the show page with EarningType permissions" do
    visit job_position_url(@job_position)
    assert_selector "p", text: "Earning Types", count: 1
    assert_selector "a", text: "FRONT END (FRONTEND)", count: 1 # Link to EarningType
    assert_selector "a", text: "1-2 ($1.00)", count: 1 # Link to EarningRate
    assert_text "You are not authorized to view this content.", count: 0
  end

  test "visiting the show page without EarningType permissions" do
    @user.permissions["can_manage_earning_types"] = false
    visit job_position_url(@job_position)
    assert_selector "p", text: "Earning Types", count: 1
    assert_text "You are not authorized to view this content."
  end

  test "creating a Job position" do
    visit job_positions_url
    click_on "New Job Position"

    check "Active" if @job_position.active
    fill_in "Name", with: @job_position.name
    click_on "Create Job position"

    assert_text "Job position was successfully created"
  end

  test "updating a Job position" do
    visit job_position_url(@job_position)
    click_on "Edit", match: :first

    check "Active" if @job_position.active
    fill_in "Name", with: @job_position.name
    click_on "Update Job position"

    assert_text "Job position was successfully updated"
  end

  test "destroying a Job position" do
    visit edit_job_position_url(@job_position)
    click_on "Delete", match: :first
  end
end
