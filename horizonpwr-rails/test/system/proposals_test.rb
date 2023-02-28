require "application_system_test_case"

class ProposalsTest < ApplicationSystemTestCase
  setup do
    @proposal = proposals(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit proposals_url
    assert_selector "h1", text: "New Proposals"
  end

  # test "creating a Proposal" do
  #   visit proposals_url
  #   click_on "New Proposal"
  #
  #   click_on "Create Proposal"
  #
  #   assert_text "Proposal was successfully created"
  #   assert_selector "h1", text: "Proposals"
  # end

  test "block a Proposal" do
    visit proposal_url(@proposal)

    click_on "Block Proposal"

    fill_in("Reason incomplete", with: "My String")
    assert_text "Update Proposal"
    click_on "Update Proposal"

    assert_text "Proposal was successfully updated"
  end

  test "should not destroy a Proposal" do
    visit edit_proposal_url(@proposal)
    assert_no_button "Delete"
  end
end
