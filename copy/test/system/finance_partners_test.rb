require "application_system_test_case"

class FinancePartnersTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    @finance_partner = finance_partners(:one)
    sign_in users(:admin)
  end

  test "visiting the index" do
    visit finance_partners_url
    assert_selector "h1", text: "Finance Partners"
  end

  test "creating a Finance partner" do
    visit finance_partners_url
    click_on "New Finance Partner"

    fill_in "Name", with: @finance_partner.name
    click_on "Create Finance partner"

    assert_text "Finance partner was successfully created"
    assert_selector "h1", text: "Finance Partners"
  end

  test "updating a Finance partner" do
    visit finance_partner_url(@finance_partner)
    click_on "Edit", match: :first

    fill_in "Name", with: @finance_partner.name
    click_on "Update Finance partner"

    assert_text "Finance partner was successfully updated"
    assert_selector "h1", text: "Finance Partners"
  end

  test "destroying a Finance partner" do
    visit edit_finance_partner_url(@finance_partner)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Finance partner was successfully destroyed"
  end
end
