require "application_system_test_case"

class PendingJobPositionsTest < ApplicationSystemTestCase
  setup do
    @user = users(:admin)
    @user_being_promoted = users(:one)
    login_as @user
    @pending_job_position = pending_job_positions(:one)
  end

  test "visiting the index" do
    visit user_pending_job_positions_url(@user)
    assert_selector "h1", text: "Pending Job Positions"
  end

  test "creating a Pending job position" do
    visit user_pending_job_positions_url(@user_being_promoted)
    click_on "New Pending Job Position"

    select("Manager", from: "pending_job_position_job_position_id")
    select((Date.today.end_of_week + 1).to_s, from: "pending_job_position_effective_at")
    click_on "Create Pending job position"

    assert_text "Pending job position was successfully created"
  end

  test "updating a Pending job position" do
    @user.permissions["can_manage_pending_job_positions"] = true
    @user.save
    # visit pending_job_position_url(@pending_job_position)
    visit edit_user_pending_job_position_url(user_id: @user_being_promoted.id, id: @pending_job_position.id)

    select("Manager", from: "pending_job_position_job_position_id")
    select((Date.today.end_of_week + 1).to_s, from: "pending_job_position_effective_at")
    click_on "Update Pending job position"

    assert_text "Pending job position was successfully updated"
  end

  test "destroying a Pending job position" do
    visit edit_user_pending_job_position_url(user_id: @user_being_promoted.id, id: @pending_job_position.id)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Pending job position was successfully destroyed"
  end
end
