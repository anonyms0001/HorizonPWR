require "application_system_test_case"

class DepartmentsTest < ApplicationSystemTestCase
  class WithPermissionsDepartmentsTest < DepartmentsTest
    setup do
      @department = departments(:one)
      @user = users(:one)
      @user.permissions["can_manage_departments"] = true
      @user.save
      login_as @user
    end

    test "visiting the index" do
      visit departments_url
      assert_selector "h1", text: "Departments"
    end

    test "creating a Department" do
      visit departments_url
      click_on "New Department"

      fill_in "Name", with: @department.name
      click_on "Create Department"

      assert_text "Department was successfully created"
    end

    test "updating a Department" do
      visit department_url(@department)
      click_on "Edit", match: :first

      fill_in "Name", with: @department.name
      click_on "Update Department"

      assert_text "Department was successfully updated"
    end

    test "destroying a Department" do
      visit edit_department_url(@department)
      click_on "Delete", match: :first
      click_on "Confirm"

      assert_text "Department was successfully destroyed"
    end
  end

  class WithoutPermissionsDepartmentsTest < DepartmentsTest
    setup do
      @department = departments(:one)
      @user = users(:one)
      login_as @user
    end

    test "visiting the index" do
      visit departments_url
      assert_text "You do not have enough permissions to access that. Please, ask your manager to update your permissions."
    end

    test "creating a Department" do
      visit departments_url
      assert_text "You do not have enough permissions to access that. Please, ask your manager to update your permissions."
    end

    test "updating a Department" do
      visit department_url(@department)
      assert_text "You do not have enough permissions to access that. Please, ask your manager to update your permissions."
    end

    test "destroying a Department" do
      visit edit_department_url(@department)
      assert_text "You do not have enough permissions to access that. Please, ask your manager to update your permissions."
    end
  end
end
