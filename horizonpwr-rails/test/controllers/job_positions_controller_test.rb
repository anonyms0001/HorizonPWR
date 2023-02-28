require "test_helper"

class JobPositionsControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionJobPositionsControllerTest < JobPositionsControllerTest
    setup do
      @job_position = job_positions(:one)
      @user = users(:one)
      @user.permissions["can_manage_job_positions"] = true
      @user.save
      login_as @user
    end

    test "should get index" do
      get job_positions_url
      assert_response :success
    end

    test "should get new" do
      get new_job_position_url
      assert_response :success
    end

    test "should create job_position" do
      assert_difference("JobPosition.count") do
        post job_positions_url, params: {
          job_position: {
            active: @job_position.active,
            name: @job_position.name,
            department_id: @job_position.department_id
          }
        }
      end

      assert_redirected_to job_position_url(JobPosition.last)
    end

    test "should show job_position" do
      get job_position_url(@job_position)
      assert_response :success
    end

    test "should get edit" do
      get edit_job_position_url(@job_position)
      assert_response :success
    end

    test "should update job_position" do
      patch job_position_url(@job_position), params: {
        job_position: {
          active: @job_position.active,
          name: @job_position.name,
          department_id: @job_position.department_id
        }
      }
      assert_redirected_to job_position_url(@job_position)
    end

    test "should not destroy job_position" do
      assert_raises ActionController::RoutingError do
        delete job_position_url(@job_position)
      end
    end
  end

  class WithoutPermissionJobPositionsControllerTest < JobPositionsControllerTest
    setup do
      @job_position = job_positions(:one)
      @user = users(:nobody)
      login_as @user
    end

    test "should not get index" do
      get job_positions_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get new_job_position_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create job_position" do
      assert_no_difference("JobPosition.count") do
        post job_positions_url, params: {job_position: {active: @job_position.active, name: @job_position.name}}
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show job_position" do
      get job_position_url(@job_position)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_job_position_url(@job_position)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not update job_position" do
      patch job_position_url(@job_position), params: {job_position: {active: @job_position.active, name: @job_position.name}}
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy job_position" do
      assert_raises ActionController::RoutingError do
        delete job_position_url(@job_position)
      end
    end
  end
end
