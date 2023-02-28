require "application_system_test_case"

class ProjectsTest < ApplicationSystemTestCase
  class RegularUserProjectsTest < ProjectsTest
    setup do
      @project = projects(:one)
      @user = users(:one)
      login_as @user
    end

    test "visiting the index" do
      visit projects_url
      assert_selector "a", text: "INSTALLER"
    end

    test "updating a Project" do
      skip # We don't know what this is going to be like yet, no sense wasting time on ignorant assumptions
      visit project_url(@project)
      click_on "Edit", match: :first

      fill_in "Installer", with: @project.installer_id
      click_on "Update Project"

      assert_text "Project was successfully updated"
    end

    test "Displaying Last Updated By for Project's DynamicForm fields" do
      skip
      visit project_url(@project)

      assert_text "MyFormConfig"

      assert_text "Last Updated By" # <-- TODO: Can't figure out how to get this to show up during the test!
      click_on "Create Form response"

      assert_text "Form response was successfully created."
    end

    test "destroying a Project" do
      skip # This probably won't be a thing. Probably can't delete a project. We'll see.
      visit edit_project_url(@project)
      click_on "Delete", match: :first
    end

    test "regular user can add an attachment to a Project" do
      # NOTE: ProjectsControllerTest covers this
      skip
    end

    # TODO: Get this working. Currently, it triggers this error:
    # ActionController::ParameterMissing: param is missing or the value is empty: project
    # Did you mean?  controller
    #                action
    #                _method
    #                id
    #     app/controllers/projects_controller.rb:161:in `project_params'
    test "regular user can remove their own attachment from a Project" do
      skip
      visit project_url(@project)
      find(".dropzone").drop File.join(file_fixture_path, "installer_project_image.jpg")
      # click_button "Save"
      button = find_by_id("save-attachments")
      button.click
    end

    # TODO: Create this test once the above test ("regular user can remove their own attachment from a Project") works.
    test "regular user can't remove someone else's attachment from a Project" do
      skip
    end
  end

  class InstallerProjectsTest < ProjectsTest
    setup do
      @project = projects(:one)
      @user = users(:solar_installer)
      login_as @user
      @user.permissions["can_view_projects"] = true
      @user.save
    end

    test "visiting the index" do
      visit projects_url
      assert_selector "a", text: "INSTALLER"
    end

    test "adding attachments" do
      # NOTE: ProjectsControllerTest covers this
      skip
    end
  end
end
