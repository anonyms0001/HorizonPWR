require "application_system_test_case"

class NotesTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    @note = notes(:one)
    @user = users(:one)
    # TODO: Currently required for create; should be required for update and delete.
    sign_in @user
  end

  test "visiting the index" do
    visit notes_url
    assert_selector "h1", text: "Notes"
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

  test "destroying a Note" do
    visit edit_note_url(@note)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Note was successfully destroyed"
  end
end
