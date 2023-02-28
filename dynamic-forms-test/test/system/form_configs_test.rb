require "application_system_test_case"

class FormConfigsTest < ApplicationSystemTestCase
  setup do
    @form_config = form_configs(:one)
  end

  test "visiting the index" do
    visit form_configs_url
    assert_selector "h1", text: "Form Configs"
  end

  test "creating a Form config" do
    visit form_configs_url
    click_on "New Form Config"

    check "Active" if @form_config.active
    fill_in "Model", with: @form_config.model
    fill_in "Position", with: @form_config.position
    fill_in "Title", with: @form_config.title
    fill_in "Use case", with: @form_config.use_case
    click_on "Create Form config"

    assert_text "Form config was successfully created"
    assert_selector "h1", text: "Form Configs"
  end

  test "updating a Form config" do
    visit form_config_url(@form_config)
    click_on "Edit", match: :first

    check "Active" if @form_config.active
    fill_in "Model", with: @form_config.model
    fill_in "Position", with: @form_config.position
    fill_in "Title", with: @form_config.title
    fill_in "Use case", with: @form_config.use_case
    click_on "Update Form config"

    assert_text "Form config was successfully updated"
    assert_selector "h1", text: "Form Configs"
  end

  test "destroying a Form config" do
    visit edit_form_config_url(@form_config)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Form config was successfully destroyed"
  end
end
