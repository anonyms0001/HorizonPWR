require "application_system_test_case"

class InstallersTest < ApplicationSystemTestCase
  setup do
    @installer = installers(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit installers_url
    assert_selector "a", text: "Installer"
  end

  test "creating a Installer" do
    visit installers_url
    click_on "New Installer"

    check "Active" if @installer.active
    fill_in "Name", with: @installer.name
    click_on "Create Installer"

    assert_text "Installer was successfully created"
    assert_selector "p", text: "Installer"
  end

  test "updating a Installer" do
    visit installer_url(@installer)
    click_on "Edit", match: :first

    check "Active" if @installer.active
    fill_in "Name", with: @installer.name
    click_on "Update Installer"

    assert_text "Installer was successfully updated"
    assert_selector "p", text: "Installer"
  end

  test "destroying a Installer" do
    visit edit_installer_url(@installer)
    click_on "Delete", match: :first
    assert_selector "p", text: "Installer", count: 0
  end
end
