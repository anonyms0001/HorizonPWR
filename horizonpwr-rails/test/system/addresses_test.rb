require "application_system_test_case"

class AddressesTest < ApplicationSystemTestCase
  setup do
    @address = addresses(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit addresses_url
    assert_selector "a", text: "ADDRESS"
  end

  # test "creating a Address" do
  #   sign_in users(:regular)
  #   visit addresses_url
  #   click_on "New Address"
  #
  #   fill_in "Address", with: @address.address
  #   fill_in "Address type", with: @address.address_type
  #   fill_in "Latitude", with: @address.latitude
  #   fill_in "Longitude", with: @address.longitude
  #   click_on "Create Address"
  #
  #   assert_text "Address was successfully created"
  # end

  test "updating a Address" do
    visit address_url(@address)
    click_on "Edit", match: :first

    fill_in "Address", with: @address.address
    fill_in "Address type", with: @address.address_type
    fill_in "Latitude", with: @address.latitude
    fill_in "Longitude", with: @address.longitude
    click_on "Update Address"

    assert_text "Address was successfully updated"
    assert_selector "p", text: "Contacts"
  end

  # test "destroying a Address" do
  #   sign_in users(:regular)
  #   visit edit_address_url(@address)
  #   click_on "Delete", match: :first
  #
  #   assert_text "Address was successfully destroyed"
  # end
end
