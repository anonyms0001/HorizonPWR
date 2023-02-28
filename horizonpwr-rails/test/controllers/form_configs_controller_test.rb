require "test_helper"

class FormConfigsControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionFormConfigsControllerTest < FormConfigsControllerTest
    setup do
      @form_config = form_configs(:one)
      @user = users(:one)
      login_as @user
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
      assert_difference("FormConfig.count") do
        post form_configs_url, params: {form_config: {
          active: @form_config.active,
          position: @form_config.position,
          title: @form_config.title,
          dynamic_form_id: dynamic_forms(:one).id
        }}
      end

      assert_redirected_to FormConfig.last.dynamic_form
    end

    test "should not create form_config without title" do
      assert_no_difference("FormConfig.count") do
        post form_configs_url, params: {form_config: {
          active: @form_config.active,
          position: @form_config.position,
          title: "",
          dynamic_form_id: dynamic_forms(:one).id
        }}
      end

      assert_response 422
      assert_select "body", /Title can't be blank/
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
      patch form_config_url(@form_config), params: {form_config: {
        active: @form_config.active,
        position: @form_config.position,
        title: @form_config.title,
        dynamic_form_id: dynamic_forms(:one).id
      }}
      assert_redirected_to form_config_url(@form_config)
    end

    test "should destroy form_config" do
      assert_difference("FormConfig.count", -1) do
        delete form_config_url(@form_config)
      end

      assert_redirected_to form_configs_url
    end
  end

  class WithoutPermissionFormConfigsControllerTest < FormConfigsControllerTest
    setup do
      @form_config = form_configs(:one)
      @user = users(:nobody)
      login_as @user
    end

    test "should not get index" do
      get form_configs_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get new_form_config_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create form_config" do
      assert_no_difference("FormConfig.count") do
        post form_configs_url, params: {form_config: {
          active: @form_config.active,
          position: @form_config.position,
          title: @form_config.title,
          dynamic_form_id: dynamic_forms(:one).id
        }}
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create form_config without title" do
      assert_no_difference("FormConfig.count") do
        post form_configs_url, params: {form_config: {
          active: @form_config.active,
          position: @form_config.position,
          title: "",
          dynamic_form_id: dynamic_forms(:one).id
        }}
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show form_config" do
      get form_config_url(@form_config)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_form_config_url(@form_config)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not update form_config" do
      patch form_config_url(@form_config), params: {form_config: {
        active: @form_config.active,
        position: @form_config.position,
        title: @form_config.title,
        dynamic_form_id: dynamic_forms(:one).id
      }}

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy form_config" do
      assert_no_difference("FormConfig.count", -1) do
        delete form_config_url(@form_config)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end
  end
end
