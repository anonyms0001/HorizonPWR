require "test_helper"

class CalendarsControllerTest < ActionDispatch::IntegrationTest
  class WithoutPermissionsCalendarsControllerTest < CalendarsControllerTest
    setup do
      @user = users(:one)
      login_as @user
    end

    test "should get show" do
      skip # We don't access the Show page. Is this used for the web calendar? If so, it is failing and needs fixed.
      get calendars_url(@user.secure_public_id, protocol: :webcal, format: :ics)
      assert_response :success
    end

    test "should get index" do
      get calendars_url
      assert_redirected_to root_path
      follow_redirect!
      assert_select "div", text: "You do not have enough permissions to access that. Please, ask your manager to update your permissions."
    end

    test "should not display View As feature" do
      get calendars_url
      assert_select "div", text: "View As", count: 0
    end
  end

  class WithPermissionsCalendarsControllerTest < CalendarsControllerTest
    setup do
      @user = users(:one)
      login_as @user
      @user.permissions["can_view_calendar_views"] = true
      @user.save
    end

    test "should get index" do
      get calendars_url
      assert_response :success
    end

    test "should display View As feature" do
      get calendars_url
      assert_select "div", text: "Viewing As", count: 1
    end
  end
end
