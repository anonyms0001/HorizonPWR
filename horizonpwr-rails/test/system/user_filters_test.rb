require "application_system_test_case"

class UserFiltersTest < ApplicationSystemTestCase
  setup do
    @user_filter = user_filters(:one)
  end

  # TODO: We need to actually test whether the correct content is showing up when filters are applied.

  test "visiting the index" do
    skip
    visit user_filters_url
    assert_selector "h1", text: "User Filters"
  end

  test "creating a User filter" do
    skip
    visit user_filters_url
    click_on "New User Filter"

    fill_in "Filter", with: @user_filter.filter
    fill_in "Name", with: @user_filter.name
    fill_in "User", with: @user_filter.user_id
    click_on "Create User filter"

    assert_text "User filter was successfully created"
  end

  test "updating a User filter" do
    skip
    visit user_filter_url(@user_filter)
    click_on "Edit", match: :first

    fill_in "Filter", with: @user_filter.filter
    fill_in "Name", with: @user_filter.name
    fill_in "User", with: @user_filter.user_id
    click_on "Update User filter"

    assert_text "User filter was successfully updated"
  end

  test "destroying a User filter" do
    skip
    visit edit_user_filter_url(@user_filter)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "User filter was successfully destroyed"
  end
end
