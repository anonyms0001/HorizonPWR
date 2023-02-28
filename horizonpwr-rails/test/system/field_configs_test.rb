require "application_system_test_case"

class FieldConfigsTest < ApplicationSystemTestCase
  setup do
    @field_config = field_configs(:one)
    @user = users(:two)
    login_as @user
  end

  test "visiting the index" do
    visit field_configs_url
    assert_selector "h1", text: "Field Configs"
  end

  test "verifying text_field/area shows up properly" do
    @user.permissions["can_manage_dynamic_forms"] = true
    visit url_for(@field_config)
    fill_in "field_config_response", with: "Anything"
  end

  test "verifying check_box shows up properly" do
    @user.permissions["can_manage_dynamic_forms"] = true
    visit url_for(@field_config)
    click_on "Edit"
    select("check_box", from: "field_type")
    click_on "Update Field config"
    assert_text "Field config was successfully updated."
    check("field_config_response")
  end

  test "verifying select shows up properly" do
    @user.permissions["can_manage_dynamic_forms"] = true
    visit url_for(@field_config)
    click_on "Edit"
    select("select", from: "field_type")
    fill_in "field_config_options", with: "MyFirstOption"
    click_on "Update Field config"
    assert_text "Field config was successfully updated."
    select("MyFirstOption", from: "select-#{@field_config.title.parameterize}")
  end

  # NOTE: Moved to FormConfigs system test
  # test "creating a Field config" do
  #   visit field_configs_url
  #   click_on "New Field Config"
  #
  #   fill_in "Field type", with: @field_config.field_type
  #   fill_in "Form config", with: @field_config.form_config_id
  #   fill_in "Label", with: @field_config.label
  #   fill_in "Name", with: @field_config.name
  #   fill_in "Options", with: @field_config.options
  #   fill_in "Position", with: @field_config.position
  #   check "Repeatable" if @field_config.repeatable
  #   check "Required" if @field_config.required
  #   click_on "Create Field config"
  #
  #   assert_text "Field config was successfully created"
  #   assert_selector "h1", text: "Field Configs"
  # end
  #
  # NOTE: Moved to FormConfigs system test
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

  # NOTE: Moved to FormConfigs system test
  # test "destroying a Field config" do
  #   visit edit_field_config_url(@field_config)
  #   click_on "Delete", match: :first
  #   click_on "Confirm"
  #
  #   assert_text "Field config was successfully destroyed"
  # end
end
