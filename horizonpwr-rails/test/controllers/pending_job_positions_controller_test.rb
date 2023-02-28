require "test_helper"

class PendingJobPositionsControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionPendingJobPositionsControllerTest < PendingJobPositionsControllerTest
    setup do
      @user = users(:admin)
      login_as @user
      @pending_job_position = pending_job_positions(:one)
    end

    test "should get index" do
      get user_pending_job_positions_url(user_id: @user.id)
      assert_response :success
    end

    test "should get new" do
      get new_user_pending_job_position_url(user_id: @user.id)
      assert_response :success
    end

    test "should create pending_job_position" do
      assert_difference("PendingJobPosition.count") do
        post user_pending_job_positions_url(user_id: @user.id), params: {
          pending_job_position: {
            created_by_id: @pending_job_position.created_by_id,
            effective_at: @pending_job_position.effective_at,
            job_position_id: @pending_job_position.job_position_id
          }
        }
      end

      assert_redirected_to user_pending_job_positions_url(@user)
    end

    test "should show pending_job_position" do
      get user_pending_job_positions_url(@pending_job_position)
      assert_response :success
    end

    test "should get edit" do
      get edit_user_pending_job_position_url(user_id: @user.id, id: @pending_job_position.id)
      assert_response :success
    end

    test "should update pending_job_position" do
      patch user_pending_job_position_url(user_id: @user.id, id: @pending_job_position.id), params: {
        pending_job_position: {
          created_by_id: @pending_job_position.created_by_id,
          effective_at: @pending_job_position.effective_at,
          job_position_id: @pending_job_position.job_position_id,
          status: @pending_job_position.status,
          user_id: @pending_job_position.user_id
        }
      }
      assert_redirected_to user_pending_job_positions_url
    end

    test "should destroy pending_job_position" do
      assert_difference("PendingJobPosition.count", -1) do
        delete user_pending_job_position_url(user_id: @user.id, id: @pending_job_position)
      end

      assert_redirected_to user_pending_job_positions_url
    end
  end

  class WithoutPermissionPendingJobPositionsControllerTest < PendingJobPositionsControllerTest
    setup do
      @user = users(:nobody)
      login_as @user
      @pending_job_position = pending_job_positions(:one)
    end

    test "should not get index" do
      get user_pending_job_positions_url(user_id: @user.id)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get new_user_pending_job_position_url(user_id: @user.id)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create pending_job_position" do
      assert_no_difference("PendingJobPosition.count") do
        post user_pending_job_positions_url(user_id: @user.id), params: {
          pending_job_position: {
            created_by_id: @pending_job_position.created_by_id,
            effective_at: @pending_job_position.effective_at,
            job_position_id: @pending_job_position.job_position_id
          }
        }
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show pending_job_position" do
      get user_pending_job_positions_url(@pending_job_position)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_user_pending_job_position_url(user_id: @user.id, id: @pending_job_position.id)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not update pending_job_position" do
      patch user_pending_job_position_url(user_id: @user.id, id: @pending_job_position.id), params: {
        pending_job_position: {
          created_by_id: @pending_job_position.created_by_id,
          effective_at: @pending_job_position.effective_at,
          job_position_id: @pending_job_position.job_position_id,
          status: @pending_job_position.status,
          user_id: @pending_job_position.user_id
        }
      }

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy pending_job_position" do
      assert_no_difference("PendingJobPosition.count", -1) do
        delete user_pending_job_position_url(user_id: @user.id, id: @pending_job_position)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end
  end
end
