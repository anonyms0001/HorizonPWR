require "test_helper"

class FormConfigsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @form_config = form_configs(:one)
  end

  test "should get index" do
    get form_configs_url
    assert_response :success
  end

  test "should get new" do
    get new_form_config_url
    assert_response :success
  end

  test "should create form_config" do
    assert_difference('FormConfig.count') do
      post form_configs_url, params: { form_config: { active: @form_config.active, model: @form_config.model, position: @form_config.position, title: @form_config.title, use_case: @form_config.use_case } }
    end

    assert_redirected_to form_config_url(FormConfig.last)
  end

  test "should show form_config" do
    get form_config_url(@form_config)
    assert_response :success
  end

  test "should get edit" do
    get edit_form_config_url(@form_config)
    assert_response :success
  end

  test "should update form_config" do
    patch form_config_url(@form_config), params: { form_config: { active: @form_config.active, model: @form_config.model, position: @form_config.position, title: @form_config.title, use_case: @form_config.use_case } }
    assert_redirected_to form_config_url(@form_config)
  end

  test "should destroy form_config" do
    assert_difference('FormConfig.count', -1) do
      delete form_config_url(@form_config)
    end

    assert_redirected_to form_configs_url
  end
end
