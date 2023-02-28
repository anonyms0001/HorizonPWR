require "application_system_test_case"

class ConcessionsTest < ApplicationSystemTestCase
  setup do
    @concession = concessions(:one)
    @user = users(:one)
    login_as @user
    @user.permissions["can_manage_concessions"] = true
    @user.save
  end

  test "visiting the index" do
    visit concessions_url
    assert_selector "h1", text: "Concessions"
  end

  # test "creating a Concession" do
  #   visit concessions_url
  #   click_on "New Concession"
  #
  #   fill_in "Amount", with: @concession.amount
  #   find("h1").click
  #   select(@concession.project_id, from: "concession_project_id")
  #   find("h1").click
  #   click_on "Create Concession"
  #
  #   assert_text "Concession was successfully created"
  # end

  # NOTE: We currently do not allow editing of concessions.
  # test "updating a Concession" do
  #   visit concession_url(@concession)
  #   click_on "Edit", match: :first
  #
  #   fill_in "Amount", with: @concession.amount
  #   fill_in "Project", with: @concession.project_id
  #   click_on "Update Concession"
  #
  #   assert_text "Concession was successfully updated"
  # end

  test "destroying a Concession" do
    visit edit_concession_url(@concession)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Concession was successfully destroyed"
  end
end
