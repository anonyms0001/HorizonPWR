require "application_system_test_case"

class AdminFeedbacksTest < ApplicationSystemTestCase
  setup do
    @feedback = feedbacks(:one)
    @user = users(:admin)
    login_as @user
  end

  test "visiting the index" do
    visit feedbacks_url
    assert_selector "h1", text: "Feedback"
  end

  test "creating a Feedback" do
    visit feedbacks_url
    click_on "New Feedback"

    select @feedback.purpose, from: "Purpose"
    select @feedback.status, from: "Status"
    fill_in "Title", with: @feedback.title
    fill_in "Tracker", with: @feedback.tracker_id
    find_trix_editor("feedback_note_attributes_body")
    click_on "Create Feedback"

    assert_text "Feedback was successfully created"
    assert_selector "p", text: "Feedbacks"
  end

  test "updating a Feedback" do
    visit feedback_url(@feedback)
    click_on "Edit", match: :first

    select @feedback.purpose, from: "Purpose"
    select @feedback.status, from: "Status"
    fill_in "Title", with: @feedback.title
    fill_in "Tracker", with: @feedback.tracker_id
    find_trix_editor("feedback_note_attributes_body")
    # TODO: fill_in_trix_editor "feedback_note_attributes_body", with: @feedback.title
    click_on "Update Feedback"

    assert_text "Feedback was successfully updated"
    assert_selector "p", text: "Feedbacks"
  end

  # NOTE: We currently do not allow Feedbacks to be destroyed.
  # test "destroying a Feedback" do
  #   visit edit_feedback_url(@feedback)
  #   click_on "Delete", match: :first
  #   click_on "Confirm"
  #
  #   assert_text "Feedback was successfully destroyed"
  # end
end

class StandardUserFeedbacksTest < ApplicationSystemTestCase
  setup do
    @feedback = feedbacks(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit feedbacks_url
    assert_selector "h1", text: "Feedback"
  end

  test "creating a Feedback" do
    visit feedbacks_url
    click_on "New Feedback"

    assert_no_select "Purpose"
    assert_no_select "Status"
    fill_in "Title", with: @feedback.title
    find_trix_editor("feedback_note_attributes_body")
    click_on "Create Feedback"

    assert_text "Feedback was successfully created"
    assert_selector "p", text: "Feedbacks"
  end

  test "updating a Feedback" do
    visit feedback_url(@feedback)
    click_on "Edit", match: :first

    assert_no_select "Purpose"
    assert_no_select "Status"
    fill_in "Title", with: @feedback.title
    find_trix_editor("feedback_note_attributes_body")
    click_on "Update Feedback"

    assert_text "Feedback was successfully updated"
    assert_selector "p", text: "Feedbacks"
  end

  # NOTE: We currently do not allow Feedbacks to be destroyed.
  # test "destroying a Feedback" do
  #   visit edit_feedback_url(@feedback)
  #   click_on "Delete", match: :first
  #   click_on "Confirm"
  #
  #   assert_text "Feedback was successfully destroyed"
  # end
end
