require "application_system_test_case"

class ContactAddressesTest < ApplicationSystemTestCase
  setup do
    @contact_address = contact_addresses(:one)
  end

  # test "visiting the index" do
  #   visit contactAddresses_url
  #   assert_selector "h1", text: "Contact Addresses"
  # end
  #
  # test "creating a Contact address" do
  #   visit contactAddresses_url
  #   click_on "New Project Contact Address"
  #
  #   fill_in "Appointment", with: @contact_address.appointment_id
  #   fill_in "Contact", with: @contact_address.contact_id
  #   check "Primary contact" if @contact_address.primary_contact
  #   fill_in "Project", with: @contact_address.project_id
  #   click_on "Create Contact address"
  #
  #   assert_text "Contact address was successfully created"
  #   assert_selector "h1", text: "Project Contact Addresses"
  # end
  #
  # test "updating a Contact address" do
  #   visit contactAddress_url(@contact_address)
  #   click_on "Edit", match: :first
  #
  #   fill_in "Appointment", with: @contact_address.appointment_id
  #   fill_in "Contact", with: @contact_address.contact_id
  #   check "Primary contact" if @contact_address.primary_contact
  #   fill_in "Project", with: @contact_address.project_id
  #   click_on "Update Contact address"
  #
  #   assert_text "Contact address was successfully updated"
  #   assert_selector "h1", text: "Project Contact Addresses"
  # end
  #
  # test "destroying a Contact address" do
  #   visit edit_contactAddress_url(@contact_address)
  #   click_on "Delete", match: :first
  #   click_on "Confirm"
  #
  #   assert_text "Contact address was successfully destroyed"
  # end
end
