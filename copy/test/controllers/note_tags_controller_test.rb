require "test_helper"

class NoteTagsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @note = notes(:one)
    sign_in users(:one) # Needs access to current_user
  end

  test "should create note tag" do
    post note_tags_url, params: {
      id: @note.id,
      tag: "Test Tag"
    }

    assert_equal ["Test Tag"], @note.tag_list
  end

  test "should destroy note tag" do
    post delete_tag_url, params: {
      id: @note.id,
      tag: "Test Tag"
    }

    assert_equal [], @note.tag_list
  end
end
