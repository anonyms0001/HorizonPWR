require "application_system_test_case"

class UplineRelationsTest < ApplicationSystemTestCase
  setup do
    @upline_relation = upline_relations(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit upline_relations_url
    assert_selector "h1", text: "Upline Relations"
  end

  test "creating a Upline relation" do
    visit new_upline_relation_url

    check "Active" if @upline_relation.active
    select("Manager User", from: "upline_relation_upline_id")
    select("Manager2 User", from: "upline_relation_downline_id")
    click_on "Create Upline relation"

    assert_text "Upline relation was successfully created"
  end

  test "updating a Upline relation" do
    visit upline_relation_url(@upline_relation)
    assert_selector "Edit", count: 0
  end

  test "destroying a Upline relation" do
    visit edit_upline_relation_url(@upline_relation)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "We don't delete Upline relations"
  end
end
