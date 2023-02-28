require "test_helper"

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = projects(:one)
    @user = users(:one)
    login_as @user, scope: :user
  end

  test "should get index" do
    get projects_url
    assert_response :success
  end

  test "should get new" do
    get new_project_url
    assert_response :success
  end

  test "should create project" do
    @proposal = proposals(:one)
    @appointment = appointments(:one)
    @address = addresses(:one)
    assert_difference("Project.count") do
      post projects_url, params: {
        project: {
          installer_id: @project.installer_id,
          address_id: @address.id,
          proposal_id: @proposal.id,
          appointments: {
            date: @appointment.date
          }
        }
      }
    end
  end

  test "should show project" do
    get project_url(@project)
    assert_response :success
  end

  test "should get edit" do
    get edit_project_url(@project)
    assert_response :success
  end

  test "should update project" do
    patch project_url(@project), params: {project: {installer_id: @project.installer_id}}
    assert_redirected_to project_url(@project)
  end

  test "should destroy project" do
    assert_difference("Project.count", -1) do
      delete project_url(@project)
    end

    assert_redirected_to projects_url
  end
end
