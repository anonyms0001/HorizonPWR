require "test_helper"

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionProjectsControllerTest < ProjectsControllerTest
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
            system_size: 2.6,
            energy_efficiency_pack: false,
            battery_backup: false,
            fundings: {
              finance_partner_id: finance_partners(:one).id
            },
            appointments: {
              start_at: @appointment.start_at,
              appointment_type: "site audit",
              scheduled_with_id: users(:ec).id
            }
          }
        }
      end

      assert_redirected_to Project.last
      follow_redirect!
      # Make sure an Event was created.
      assert_select("div#event_#{Event.last.id}")
    end

    # Error:
    # ProjectsControllerTest::WithPermissionProjectsControllerTest#test_should_show_project:
    # ActionView::Template::Error: undefined method `energy_consultant_select' for nil:NilClass
    #     app/views/appointments/_form.html.erb:67
    #     app/views/appointments/_form.html.erb:1
    #     app/views/projects/show.html.erb:282
    # TODO: Fix this.
    #       Project#show loads the Appointment form with @appointment, which is an instance of
    #       Appointment#new without an account_id. This causes the error because the form
    #       needs to load form.object.account.energy_consultant_select but account is nil.
    test "should show project" do
      skip
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

    # TODO: This currently triggers the following error:
    #       ActiveRecord::InvalidForeignKey: PG::ForeignKeyViolation: ERROR:  update or delete on table "appointments" violates foreign key constraint "fk_rails_3e160822bd" on table "proposals"
    #       We should be able to resolve this when we get soft deletion in place.
    test "should destroy project" do
      skip
      assert_difference("Project.count", -1) do
        delete project_url(@project)
      end

      assert_redirected_to projects_url
    end

    test "should add attachment to project" do
      patch project_url(@project), params: {project: {attachments: fixture_file_upload("installer_project_image.jpg", "image/png")}}
      assert_redirected_to project_url(@project)
      follow_redirect!
      assert_select "body", /Project was successfully updated./
    end
  end

  class InstallerProjectsControllerTest < ProjectsControllerTest
    setup do
      @project = projects(:one)
      @user = users(:solar_installer)
      login_as @user, scope: :user
      @user.permissions["can_view_projects"] = true
      @user.save
    end

    test "should add attachment to project" do
      patch project_url(@project), params: {project: {attachments: fixture_file_upload("installer_project_image.jpg", "image/png")}}
      assert_redirected_to project_url(@project)
      follow_redirect!
      assert_select "body", /Project was successfully updated./
    end
  end

  class WithoutPermissionProjectsControllerTest < ProjectsControllerTest
    setup do
      @project = projects(:one)
      @user = users(:nobody)
      login_as @user, scope: :user
    end

    test "should not get index" do
      get projects_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get new_project_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create project" do
      @proposal = proposals(:one)
      @appointment = appointments(:one)
      @address = addresses(:one)
      assert_no_difference("Project.count") do
        post projects_url, params: {
          project: {
            installer_id: @project.installer_id,
            address_id: @address.id,
            proposal_id: @proposal.id,
            system_size: 2.6,
            energy_efficiency_pack: false,
            battery_backup: false,
            fundings: {
              finance_partner_id: finance_partners(:one).id
            },
            appointments: {
              start_at: @appointment.start_at,
              appointment_type: "site audit",
              scheduled_with_id: users(:ec).id
            }
          }
        }
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show project" do
      get project_url(@project)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_project_url(@project)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    # TODO: Make sure this gets fixed. The project_attachments? method in the ProjectPolicy is always true right now, so
    #       this test breaks.
    test "should not update project" do
      skip
      patch project_url(@project), params: {project: {installer_id: installers(:two).id}}
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy project" do
      assert_no_difference("Project.count") do
        delete project_url(@project)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end
  end
end
