require "application_system_test_case"

class NotesTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  class RegularUserNotesTest < NotesTest
    setup do
      @note = notes(:one)
      @user = users(:one)
      # TODO: Currently required for create; should be required for update and delete.
      sign_in @user
    end

    test "visiting the index" do
      visit notes_url
      assert_text "You do not have enough permissions to access that. Please, ask your manager to update your permissions."
    end

    test "creating a Note from the Project Show page" do
      logout @user
      sign_in users(:admin)
      @project = projects(:one)
      visit project_url(@project)
      click_on "Create Note"
      assert_text "Note was successfully created"
    end

    test "updating a Note" do
      visit note_url(@note)
      click_on "Edit", match: :first
      click_on "Update Note"

      assert_text "Note was successfully updated"
      assert_selector "div", text: "Note was successfully updated"
    end

    # NOTE: We currently do not allow Notes to be destroyed.
    test "destroying a Note" do
      visit edit_note_url(@note)
      assert_no_text "Delete"
    end
  end

  class InstallerUserNotesTest < NotesTest
    setup do
      @note = notes(:installer_note)
      @user = users(:solar_installer)
      @user.permissions["can_view_projects"] = true
      @user.save!
      # TODO: Currently required for create; should be required for update and delete.
      sign_in @user
    end

    test "visiting the index" do
      visit notes_url
      assert_text "You do not have enough permissions to access that. Please, ask your manager to update your permissions."
    end

    test "creating a Note from the Project Show page" do
      @project = projects(:one)
      visit project_url(@project)
      click_on "Create Note"
      assert_text "Note was successfully created"
    end

    test "updating a Note" do
      visit note_url(@note)
      click_on "Edit", match: :first
      click_on "Update Note"

      assert_text "Note was successfully updated"
      assert_selector "div", text: "Note was successfully updated"
    end

    # NOTE: We currently do not allow Notes to be destroyed.
    test "destroying a Note" do
      visit edit_note_url(@note)
      assert_no_text "Delete"
    end
  end
end
