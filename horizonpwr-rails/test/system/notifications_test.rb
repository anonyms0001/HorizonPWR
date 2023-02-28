require "application_system_test_case"

class NotificationsTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:one)
    @feedback_1 = feedbacks(:one)
    @feedback_2 = feedbacks(:two)
    @dev_user = users(:dev)
    sign_in @user
  end

  # TODO: Fix. The last line returns a count of 0 unread messages.
  test "Mark notifications as read for all notifications within a thread" do
    skip

    # NOTE: User One creates two notes on Feedback 1
    visit feedback_url(@feedback_1)
    find(:css, "trix-editor[id=note_body]").set("Lorem Ipsum 1")
    click_on "Create Note"
    assert_text "Note was successfully created"

    find(:css, "trix-editor[id=note_body]").set("Lorem Ipsum 2")
    click_on "Create Note"
    assert_text "Note was successfully created"

    # NOTE: User One creates two notes on Feedback 2
    visit feedback_url(@feedback_2)
    find(:css, "trix-editor[id=note_body]").set("Lorem Ipsum 3")
    click_on "Create Note"
    assert_text "Note was successfully created"

    find(:css, "trix-editor[id=note_body]").set("Lorem Ipsum 4")
    click_on "Create Note"
    assert_text "Note was successfully created"

    # NOTE: User One logs out and Dev User logs in to view notifications.
    logout @user
    sign_in @dev_user

    visit notifications_url
    assert_selector 'a[data-notifications-target="notification"]', count: 4
    assert_selector 'a[data-notifications-target="notification"][data-interacted-at]', count: 0

    # NOTE: Because these are displayed newest first, Lorem Ipsum 4 is at the top.
    first('a[data-notifications-target="notification"]').click
    assert_text "Lorem Ipsum 4"

    # NOTE: Returning to the notifications, there should be two unread notifications, since all notes from Feedback 2
    #       should now be marked as read.
    visit notifications_url
    assert_selector 'a[data-notifications-target="notification"][data-interacted-at]', count: 2
  end
end
