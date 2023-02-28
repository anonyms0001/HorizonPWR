require "application_system_test_case"

class ContestsTest < ApplicationSystemTestCase
  setup do
    @contest = contests(:one)
  end

  # TODO: Before these can be fixed, the following must be fixed:
  #       test/controllers/contests_controller_test.rb
  test "visiting the index" do
    skip
    visit contests_url
    assert_selector "h1", text: "Contests"
  end

  test "creating a Contest" do
    skip
    visit contests_url
    click_on "New Contest"

    fill_in "End at", with: @contest.end_at
    fill_in "Name", with: @contest.name
    fill_in "Start at", with: @contest.start_at
    click_on "Create Contest"

    assert_text "Contest was successfully created"
  end

  test "updating a Contest" do
    skip
    visit contest_url(@contest)
    click_on "Edit", match: :first

    fill_in "End at", with: @contest.end_at
    fill_in "Name", with: @contest.name
    fill_in "Start at", with: @contest.start_at
    click_on "Update Contest"

    assert_text "Contest was successfully updated"
  end

  test "destroying a Contest" do
    skip
    visit edit_contest_url(@contest)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Contest was successfully destroyed"
  end
end
