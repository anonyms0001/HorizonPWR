require "application_system_test_case"

class JobPositionsTest < ApplicationSystemTestCase
  setup do
    @job_position = job_positions(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit job_positions_url
    assert_selector "a", text: "NAME"
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
