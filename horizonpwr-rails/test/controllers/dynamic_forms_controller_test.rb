require "test_helper"

class DynamicFormsControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionDynamicFormsControllerTest < DynamicFormsControllerTest
    setup do
      @dynamic_form = dynamic_forms(:one)
      @user = users(:one)
      login_as @user
    end

    test "should get index" do
      get dynamic_forms_url
      assert_response :success
    end

    test "should get new" do
      get new_dynamic_form_url
      assert_response :success
    end

    test "should create dynamic_form" do
      assert_difference("DynamicForm.count") do
        post dynamic_forms_url, params: {dynamic_form: {
          model: @dynamic_form.model,
          use_case: @dynamic_form.use_case
        }}
      end

      assert_redirected_to dynamic_form_url(DynamicForm.last)
    end

    test "should not create dynamic_form without model" do
      assert_no_difference("DynamicForm.count") do
        post dynamic_forms_url, params: {dynamic_form: {
          model: "",
          use_case: @dynamic_form.use_case
        }}
      end

      assert_select "body", /Model can't be blank/
    end

    test "should not create dynamic_form without use_case" do
      assert_no_difference("DynamicForm.count") do
        post dynamic_forms_url, params: {dynamic_form: {
          model: @dynamic_form.model,
          use_case: ""
        }}
      end

      assert_select "body", /Use case can't be blank/
    end

    test "should show dynamic_form" do
      get dynamic_form_url(@dynamic_form)
      assert_response :success
    end

    test "should get edit" do
      get edit_dynamic_form_url(@dynamic_form)
      assert_response :success
    end

    test "should update dynamic_form" do
      patch dynamic_form_url(@dynamic_form), params: {dynamic_form: {
        model: @dynamic_form.model,
        use_case: @dynamic_form.use_case
      }}
      assert_redirected_to dynamic_form_url(@dynamic_form)
    end

    test "should destroy dynamic_form" do
      assert_difference("DynamicForm.count", -1) do
        delete dynamic_form_url(@dynamic_form)
      end

      assert_redirected_to dynamic_forms_url
    end
  end

  class WithoutPermissionDynamicFormsControllerTest < DynamicFormsControllerTest
    setup do
      @dynamic_form = dynamic_forms(:one)
      @user = users(:nobody)
      login_as @user
    end

    test "should not get index" do
      get dynamic_forms_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get new_dynamic_form_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create dynamic_form" do
      assert_no_difference("DynamicForm.count") do
        post dynamic_forms_url, params: {dynamic_form: {
          model: @dynamic_form.model,
          use_case: @dynamic_form.use_case
        }}
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show dynamic_form" do
      get dynamic_form_url(@dynamic_form)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "shoul not get edit" do
      get edit_dynamic_form_url(@dynamic_form)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not update dynamic_form" do
      patch dynamic_form_url(@dynamic_form), params: {dynamic_form: {
        model: @dynamic_form.model,
        use_case: @dynamic_form.use_case
      }}

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy dynamic_form" do
      assert_no_difference("DynamicForm.count", -1) do
        delete dynamic_form_url(@dynamic_form)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end
  end
end
