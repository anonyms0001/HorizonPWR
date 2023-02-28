require "test_helper"

class UserFiltersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_filter = user_filters(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    assert_raises ActionController::RoutingError do
      get user_filters_url
    end
  end

  test "should get new" do
    # New page should only be rendered if no name is provided, and never accessed directly.
    assert_raises ActionView::Template::Error do
      get new_user_filter_url
    end
  end

  test "should create user_filter" do
    assert_difference("UserFilter.count") do
      post user_filters_url, params: {user_filter: {filter: @user_filter.filter, name: @user_filter.name, user_id: @user_filter.user_id}}
    end

    assert_redirected_to calendars_url
  end

  test "should show user_filter" do
    assert_raises ActionController::RoutingError do
      get user_filter_url(@user_filter)
    end
  end

  test "should not get edit" do
    assert_raises NoMethodError do
      get edit_user_filter_url(@user_filter)
    end
  end

  test "should update user_filter" do
    patch user_filter_url(@user_filter), params: {user_filter: {filter: @user_filter.filter, name: @user_filter.name, user_id: @user_filter.user_id}}
    assert_redirected_to calendars_url
  end

  test "should destroy user_filter" do
    assert_difference("UserFilter.count", -1) do
      delete user_filter_url(@user_filter)
    end

    assert_redirected_to calendars_url
  end
end
