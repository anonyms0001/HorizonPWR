require "application_system_test_case"

class CalendarsTest < ApplicationSystemTestCase
  setup do
    @user = users(:one)
    login_as @user
    @user.permissions["can_view_calendar_views"] = true
    @user.save
  end

  test "visiting the index" do
    visit calendars_url
    assert_selector ".h3", text: "#{Date.today.strftime("%B")} #{Date.today.year}"
  end

  test "creating a Concession" do
    skip # TODO: Test fails because selecting an option from the dropdown selector does not fire the JavaScript to add the param.

    @view_as_user = users(:two)
    visit calendars_url

    assert_selector "#view_as_div", text: "View As"
    select(@view_as_user.name, from: "view_as")
    assert_selector "#viewing_as_div", text: "View As"
  end

  #  TODO: Once the skipped test above is working, we need to add a test to clear the view_as_user param.
end
