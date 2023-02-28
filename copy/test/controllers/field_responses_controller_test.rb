require "test_helper"

class FieldResponsesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @field_response = field_responses(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get field_responses_url
    assert_response :success
  end

  # These are created indirectly (as part of DynamicForms), so no one should access this page directly.
  test "should not get new" do
    assert_raises NameError do
      get new_field_response_url
    end
  end

  test "should create field_response" do
    assert_difference("FieldResponse.count") do
      post field_responses_url, params: {field_response: {
        response: @field_response.response,
        field_config_id: @field_response.field_config_id,
        form_response_id: @field_response.form_response_id,
        last_updated_by_id: @field_response.last_updated_by_id
      }}
    end

    assert_redirected_to field_response_url(FieldResponse.last)
  end

  test "should show field_response" do
    get field_response_url(@field_response)
    assert_response :success
  end

  test "should get edit" do
    get edit_field_response_url(@field_response)
    assert_response :success
  end

  test "should update field_response" do
    patch field_response_url(@field_response), params: {field_response: {
      response: @field_response.response,
      field_config_id: @field_response.field_config_id,
      form_response_id: @field_response.form_response_id,
      last_updated_by_id: @field_response.last_updated_by_id
    }}
    assert_redirected_to field_response_url(@field_response)
  end

  test "should destroy field_response" do
    assert_difference("FieldResponse.count", -1) do
      delete field_response_url(@field_response)
    end

    assert_redirected_to field_responses_url
  end
end
