require "application_system_test_case"

class FieldResponsesTest < ApplicationSystemTestCase
  setup do
    @field_response = field_responses(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit field_responses_url
    assert_selector "h1", text: "Field Responses"
  end

  # Error:
  # FieldResponsesTest#test_triggering_an_event:
  # ActionView::Template::Error: undefined method `energy_consultant_select' for nil:NilClass
  #     app/views/appointments/_form.html.erb:66
  #     app/views/appointments/_form.html.erb:1
  #     app/views/projects/show.html.erb:269
  # TODO: Fix this.
  test "triggering an event" do
    skip
    @project = projects(:one)

    visit project_url(@project)
    fill_in "form_response_field_responses_attributes_0_response", with: "myresidentialanswer"
    click_on "Update Form response"
    assert_text "Form response was successfully updated"
    assert_text "#{@user.name} modified #{field_configs(:residential).title.capitalize} a second ago"
  end

  # NOTE: These are created indirectly as part of the DynamicForms form builder.
  # test "creating a Field response" do
  #   visit field_responses_url
  #   click_on "New Field Response"
  #
  #   check "Boolean response" if @field_response.boolean_response
  #   fill_in "Field config", with: @field_response.field_config_id
  #   fill_in "Form response", with: @field_response.form_response_id
  #   fill_in "Numeric response", with: @field_response.numeric_response
  #   fill_in "Text response", with: @field_response.text_response
  #   fill_in "User", with: @field_response.user_id
  #   click_on "Create Field response"
  #
  #   assert_text "Field response was successfully created"
  #   assert_selector "h1", text: "Field Responses"
  # end

  test "updating a Field response" do
    visit field_response_url(@field_response)
    click_on "Edit", match: :first

    # fill_in "Field config", with: @field_response.field_config_id
    # fill_in "Form response", with: @field_response.form_response_id
    fill_in "Response", with: @field_response.response
    # fill_in "User", with: @field_response.user_id
    click_on "Update Field response"

    assert_text "Field response was successfully updated"
    assert_selector "h1", text: "Field Responses"
  end

  test "destroying a Field response" do
    visit edit_field_response_url(@field_response)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Field response was successfully destroyed"
  end
end
