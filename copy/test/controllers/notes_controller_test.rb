require "test_helper"

class NotesControllerTest < ActionDispatch::IntegrationTest
  class UserWithPermissionsNotesControllerTest < NotesControllerTest
    setup do
      @project = projects(:one)
      @note = notes(:one)
      @child_note = notes(:note_one)
      sign_in users(:one) # Needs access to current_user
    end

    test "should get index" do
      get notes_url
      assert_response :success
    end

    test "should not get new" do
      assert_raises URI::InvalidURIError do
        get "notes/new"
      end
    end

    test "should create note" do
      assert_difference("Note.count") do
        post notes_url, params: {note: {
          account_id: @note.account_id,
          installer_id: @note.installer_id,
          user_id: @note.user_id,
          notable_id: @note.notable_id,
          notable_type: @note.notable_type
        }}
      end
    end

    test "should show note" do
      get note_url(@note)
      assert_response :success
    end

    test "should get edit" do
      get edit_note_url(@note)
      assert_response :success
    end

    test "should update note" do
      patch note_url(@note), params: {
        note: {
          account_id: @note.account_id,
          installer_id: @note.installer_id,
          user_id: @note.user_id,
          notable_id: @note.notable_id,
          notable_type: @note.notable_type
        }
      }
      assert_redirected_to @note.notable
    end

    test "should destroy note" do
      assert_difference("Note.count", -1) do
        delete note_url(@child_note)
      end

      assert_redirected_to @child_note.notable
    end
  end

  class TaggedUserNotesControllerTest < NotesControllerTest
    setup do
      @project = projects(:one)
      @note = notes(:one)
      @child_note = notes(:note_one)
      @user = users(:nobody)
      sign_in @user
    end

    test "should not show note without permission" do
      get note_url(@note)
      assert_redirected_to root_path
      assert_equal I18n.t("must_have_permissions"), flash[:alert]
    end

    test "should show note with permission" do
      @user.permissions["can_view_all_project_notes"] = true
      @user.save

      get note_url(@note)
      assert_response :success

      get note_url(@child_note)
      assert_response :success
    end
  end
end
