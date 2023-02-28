require "test_helper"

class FieldConfigsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @field_config = field_configs(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get field_configs_url
    assert_response :success
  end

  # NOTE: This form currently only gets loaded from the FormConfigs#Show page.
  # test "should get new" do
  #   get new_field_config_url
  #   assert_response :success
  # end

  test "should create field_config" do
    assert_difference("FieldConfig.count") do
      post field_configs_url, params: {field_config: {
        field_type: @field_config.field_type,
        form_config_id: @field_config.form_config_id,
        label: @field_config.label,
        title: @field_config.title,
        options: @field_config.options,
        position: @field_config.position,
        repeatable: @field_config.repeatable,
        required: @field_config.required
      }}
    end

    assert_redirected_to form_config_url(FieldConfig.last.form_config_id)
  end

  test "should not create field_config w/o title" do
    assert_no_difference("FieldConfig.count") do
      post field_configs_url, params: {field_config: {
        field_type: @field_config.field_type,
        form_config_id: @field_config.form_config_id,
        label: @field_config.label,
        title: "",
        options: @field_config.options,
        position: @field_config.position,
        repeatable: @field_config.repeatable,
        required: @field_config.required
      }}
    end

    assert_response 422
    assert_select "body", /Title can't be blank/
  end

  test "should not create field_config with field_type select and no options" do
    assert_no_difference("FieldConfig.count") do
      post field_configs_url, params: {field_config: {
        field_type: "select",
        form_config_id: @field_config.form_config_id,
        label: @field_config.label,
        title: "MyTestString",
        options: [""],
        position: @field_config.position,
        repeatable: @field_config.repeatable,
        required: @field_config.required
      }}
    end

    assert_response 422
    assert_select "body", /You must include at least 1 option for a select field./
  end

  test "should show field_config" do
    get field_config_url(@field_config)
    assert_response :success
  end

  # TODO: There is currently no way to edit these.
  # test "should get edit" do
  #   get edit_field_config_url(@field_config)
  #   assert_response :success
  # end

  test "should update field_config" do
    patch field_config_url(@field_config), params: {field_config: {
      field_type: @field_config.field_type,
      form_config_id: @field_config.form_config_id,
      label: @field_config.label,
      title: @field_config.title,
      options: @field_config.options,
      position: @field_config.position,
      repeatable: @field_config.repeatable,
      required: @field_config.required
    }}
    assert_redirected_to field_config_url(@field_config)
  end

  test "should destroy field_config" do
    assert_difference("FieldConfig.count", -1) do
      delete field_config_url(@field_config)
    end

    assert_redirected_to field_configs_url
  end
end
