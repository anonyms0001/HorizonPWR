require "application_system_test_case"

class CalendarNotesTest < ApplicationSystemTestCase
  setup do
    @calendar_note = calendar_notes(:one)
    @user = users(:one)
    login_as @user
    @user.permissions["can_manage_calendar_notes"] = true
    @user.save
  end

  test "visiting the index" do
    skip # We don't visit the Index for these.
    visit calendar_notes_url
    assert_selector "h1", text: "Calendar Notes"
  end

  # TODO: Fix this test and the one below (updating a Calendar note)
  # NOTE: This is actually a permissions issue. Fixing it will fix the other breaking test below.
  test "creating a Calendar note" do
    skip
    visit calendars_url
    # click_on "New Calendar Note"
    # find("new_global_note").click
    # find(:i, "#new_global_note").click
    # find('[id="new_global_note"]').click
    # click_link('new_global_note')
    # find(:xpath, "/html/body/div[1]/div[2]/div/main/div[1]/section/div/div/div[2]/a/i").click
    find(:css, "i.fa-sticky-note").click

    check "Active" if @calendar_note.active
    fill_in "Date", with: @calendar_note.date
    check "Global" if @calendar_note.global
    click_on "Create Calendar note"

    assert_text "Calendar note was successfully created"
  end

  test "updating a Calendar note" do
    skip
    visit calendars_url
    click_on "Edit", match: :first

    check "Active" if @calendar_note.active
    fill_in "Date", with: @calendar_note.date
    check "Global" if @calendar_note.global
    click_on "Update Calendar note"

    assert_text "Calendar note was successfully updated"
  end

  test "destroying a Calendar note" do
    skip # TODO: There is currently no way to delete a CalendarNote.
    visit edit_calendar_note_url(@calendar_note)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Calendar note was successfully destroyed"
  end
end
