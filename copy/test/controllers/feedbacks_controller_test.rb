require "test_helper"

class FeedbacksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @note = notes(:feedback_one)
    @feedback = @note.notable
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get feedbacks_url
    assert_response :success
  end

  test "should get new" do
    get new_feedback_url
    assert_response :success
  end

  test "should create feedback" do
    assert_difference("Feedback.count") do
      post feedbacks_url, params: {feedback: {purpose: @feedback.purpose, status: @feedback.status, title: @feedback.title, tracker_id: @feedback.tracker_id, user_id: @feedback.user_id}}
    end

    assert_redirected_to feedback_url(Feedback.last)
  end

  test "should show feedback" do
    get feedback_url(@feedback)
    assert_response :success
  end

  test "should get edit" do
    get edit_feedback_url(@feedback)
    assert_response :success
  end

  test "should update feedback" do
    patch feedback_url(@feedback), params: {feedback: {purpose: @feedback.purpose, status: @feedback.status, title: @feedback.title, tracker_id: @feedback.tracker_id, user_id: @feedback.user_id}}
    assert_redirected_to feedback_url(@feedback)
  end

  test "should destroy feedback" do
    assert_difference("Feedback.count", -1) do
      delete feedback_url(@feedback)
    end

    assert_redirected_to feedbacks_url
  end
end
