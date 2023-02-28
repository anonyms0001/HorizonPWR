require "test_helper"

class FormResponsesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @form_response = form_responses(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get form_responses_url
    assert_response :success
  end

  # These are created indirectly (as part of DynamicForms), so no one should access this page directly.
  test "should not get new" do
    assert_raises NameError do
      get new_form_response_url
    end
  end

  test "should create form_response" do
    assert_difference("FormResponse.count") do
      post form_responses_url, params: {form_response: {
        dynamic_form_id: @form_response.dynamic_form_id,
        respondable_id: @form_response.respondable_id,
        respondable_type: @form_response.respondable_type,
        form_config_id: @form_response.form_config_id
      }}
    end

    assert_redirected_to @form_response.respondable
  end

  test "should show form_response" do
    get form_response_url(@form_response)
    assert_response :success
  end

  test "should get edit" do
    get edit_form_response_url(@form_response)
    assert_response :success
  end

  test "should update form_response" do
    patch form_response_url(@form_response), params: {form_response: {
      dynamic_form_id: @form_response.dynamic_form_id,
      respondable_id: @form_response.respondable_id,
      respondable_type: @form_response.respondable_type,
      form_config_id: @form_response.form_config_id
    }}
    assert_redirected_to @form_response.respondable
  end

  test "should destroy form_response" do
    assert_difference("FormResponse.count", -1) do
      delete form_response_url(@form_response)
    end

    assert_redirected_to form_responses_url
  end
end
