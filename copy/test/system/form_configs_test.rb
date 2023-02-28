require "application_system_test_case"

class FormConfigsTest < ApplicationSystemTestCase
  setup do
    @form_config = form_configs(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit form_configs_url
    assert_selector "h1", text: "Form Configs"
  end

  test "creating a Form config" do
    visit dynamic_forms_url
    click_on "New Dynamic Form"
    fill_in "Model", with: "MyString"
    fill_in "Use case", with: "MyString"
    click_on "Create Dynamic form"

    check "Active" if @form_config.active
    fill_in "Title", with: @form_config.title
    click_on "Create Form config"

    assert_text "Form config was successfully created"
  end

  test "updating a Form config" do
    visit form_config_url(@form_config)
    click_on "Edit", match: :first

    check "Active" if @form_config.active
    fill_in "Title", with: @form_config.title
    click_on "Update Form config"

    assert_text "Form config was successfully updated"
  end

  test "destroying a Form config" do
    visit edit_form_config_url(@form_config)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Form config was successfully destroyed"
  end

  # NOTE: These can only be created from the FormConfig#Show page
  test "creating a Field config" do
    @field_config = field_configs(:one)

    visit form_config_url(@form_config)
    # click_on "Create Field config"

    fill_in "Title/Question/description/header thing", with: @field_config.title
    # fill_in "Form config", with: @field_config.form_config_id
    # fill_in "Label/Question", with: @field_config.label
    # fill_in "Name", with: @field_config.name
    # fill_in "Options", with: @field_config.options
    # fill_in "Position", with: @field_config.position
    # check "Repeatable" if @field_config.repeatable
    check "Required" if @field_config.required
    click_on "Create Field config"

    assert_text "Field config was successfully created"
    # assert_selector "h1", text: "Field Configs"
  end

  # TODO: We still need to add this feature.
  # test "updating a Field config" do
  #   visit field_config_url(@field_config)
  #   click_on "Edit", match: :first
  #
  #   fill_in "Field type", with: @field_config.field_type
  #   fill_in "Form config", with: @field_config.form_config_id
  #   fill_in "Label", with: @field_config.label
  #   fill_in "Name", with: @field_config.name
  #   fill_in "Options", with: @field_config.options
  #   fill_in "Position", with: @field_config.position
  #   check "Repeatable" if @field_config.repeatable
  #   check "Required" if @field_config.required
  #   click_on "Update Field config"
  #
  #   assert_text "Field config was successfully updated"
  #   assert_selector "h1", text: "Field Configs"
  # end

  # TODO: We still need to add this feature.
  # test "destroying a Field config" do
  #   visit edit_field_config_url(@field_config)
  #   click_on "Delete", match: :first
  #   click_on "Confirm"
  #
  #   assert_text "Field config was successfully destroyed"
  # end
end
