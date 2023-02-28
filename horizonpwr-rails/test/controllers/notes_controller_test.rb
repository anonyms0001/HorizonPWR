require "test_helper"

class NotesControllerTest < ActionDispatch::IntegrationTest
  class UserWithPermissionsNotesControllerTest < NotesControllerTest
    setup do
      @project = projects(:one)
      @note = notes(:one)
      @child_note = notes(:note_one)
      sign_in users(:one) # Needs access to current_user
    end

    test "should not get index" do
      get notes_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      assert_raises URI::InvalidURIError do
        get "notes/new"
      end
    end

    # TODO: Fix.
    # Error:
    # NotesControllerTest::UserWithPermissionsNotesControllerTest#test_should_create_note:
    # ActionView::Template::Error: undefined method `energy_consultant_select' for nil:NilClass
    #     app/views/appointments/_form.html.erb:66
    test "should create note" do
      skip
      assert_difference("Note.count") do
        post notes_url, params: {note: {
          account_id: @note.account_id,
          installer_id: @note.installer_id,
          user_id: @note.user_id,
          notable_id: @note.notable_id,
          notable_type: @note.notable_type,
          body: "<p id=\"my_note_body\">This is my note!</p>"
        }}
      end

      assert_redirected_to Note.last.notable
      follow_redirect!
      assert_select "body", /This is my note!/
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

  class UserWithoutPermissionsNotesControllerTest < NotesControllerTest
    setup do
      @project = projects(:one)
      @note = notes(:one)
      @child_note = notes(:note_one)
      sign_in users(:nobody) # Needs access to current_user
    end

    test "should not get index" do
      get notes_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      assert_raises URI::InvalidURIError do
        get "notes/new"
      end
    end

    # TODO: This passes when logged in as users(:admin). It seems that the policy is not being used to block this from
    #       being posted.
    test "should not create note" do
      skip

      assert_difference("Note.count") do
        post notes_url, params: {note: {
          account_id: @note.account_id,
          installer_id: @note.installer_id,
          user_id: @note.user_id,
          notable_id: @note.notable_id,
          notable_type: @note.notable_type,
          body: "<p id=\"my_note_body\">This is my note!</p>"
        }}
      end

      assert_redirected_to Note.last.notable

      follow_redirect!
      assert_select "body", /This is my note!/
    end

    test "should not show note" do
      get note_url(@note)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_note_url(@note)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not update note" do
      patch note_url(@note), params: {
        note: {
          account_id: @note.account_id,
          installer_id: @note.installer_id,
          user_id: @note.user_id,
          notable_id: @note.notable_id,
          notable_type: @note.notable_type
        }
      }

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy note" do
      assert_no_difference("Note.count", -1) do
        delete note_url(@child_note)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
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
