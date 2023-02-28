require "test_helper"

class CalendarNotesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @calendar_note = calendar_notes(:one)
    @user = users(:one)
    @user.permissions["can_manage_calendar_notes"] = true
    @user.save
    login_as @user
  end

  test "should get index" do
    get calendar_notes_url
    assert_response :success
  end

  test "should get new" do
    get new_calendar_note_url
    assert_response :success
  end

  test "should create calendar_note" do
    assert_difference("CalendarNote.count") do
      post calendar_notes_url, params: {
        calendar_note: {
          active: @calendar_note.active,
          date: @calendar_note.date,
          global: @calendar_note.global
        }
      }
    end

    assert_redirected_to calendars_url
  end

  test "should show calendar_note" do
    get calendar_note_url(@calendar_note)
    assert_response :success
  end

  test "should get edit" do
    get edit_calendar_note_url(@calendar_note)
    assert_response :success
  end

  test "should update calendar_note" do
    patch calendar_note_url(@calendar_note), params: {
      calendar_note: {
        active: @calendar_note.active,
        date: @calendar_note.date,
        global: @calendar_note.global
      }
    }
    assert_redirected_to calendars_url
  end

  test "should destroy calendar_note" do
    assert_difference("CalendarNote.count", -1) do
      delete calendar_note_url(@calendar_note)
    end

    assert_redirected_to calendar_notes_url
  end
end
