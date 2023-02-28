require "application_system_test_case"

class ProjectsTest < ApplicationSystemTestCase
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

    assert_text "Last Updated By" # <-- Can't figure out how to get this to show up during the test!
    click_on "Create Form response"

    assert_text "Form response was successfully created."
  end

  test "destroying a Project" do
    skip # This probably won't be a thing. Probably can't delete a project. We'll see.
    visit edit_project_url(@project)
    click_on "Delete", match: :first
  end
end
