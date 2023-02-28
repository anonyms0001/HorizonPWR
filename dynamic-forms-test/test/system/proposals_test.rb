require "application_system_test_case"

class ProposalsTest < ApplicationSystemTestCase
  setup do
    @proposal = proposals(:one)
  end

  test "visiting the index" do
    visit proposals_url
    assert_selector "h1", text: "Proposals"
  end

  test "creating a Proposal" do
    visit proposals_url
    click_on "New Proposal"

    fill_in "Name", with: @proposal.name
    click_on "Create Proposal"

    assert_text "Proposal was successfully created"
    assert_selector "h1", text: "Proposals"
  end

  test "updating a Proposal" do
    visit proposal_url(@proposal)
    click_on "Edit", match: :first

    fill_in "Name", with: @proposal.name
    click_on "Update Proposal"

    assert_text "Proposal was successfully updated"
    assert_selector "h1", text: "Proposals"
  end

  test "destroying a Proposal" do
    visit edit_proposal_url(@proposal)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Proposal was successfully destroyed"
  end
end
