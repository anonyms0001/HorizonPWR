require "application_system_test_case"

class FormResponsesTest < ApplicationSystemTestCase
  setup do
    @form_response = form_responses(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit form_responses_url
    assert_selector "h1", text: "Form Responses"
  end

  # NOTE: These are created indirectly as part of the DynamicForms form builder.

  test "updating a Form response" do
    @user = users(:one)
    login_as @user
    visit form_response_url(@form_response)
    click_on "Edit", match: :first

    select("One", from: @form_response.id)
    click_on "Update Form response"

    assert_text "Form response was successfully updated"
  end

  # NOTE: FormResponses should not be deleted directly.
  # test "destroying a Form response" do
  #   visit edit_form_response_url(@form_response)
  #   click_on "Delete", match: :first
  #   click_on "Confirm"
  #
  #   assert_text "Form response was successfully destroyed"
  # end
end

class UsingFormResponsesTest < ApplicationSystemTestCase
  setup do
    @dynamic_form = dynamic_forms(:onboarding)
    @user = users(:inactive)
    login_as @user
  end

  # test "submitting a Form response" do
  #   visit onboarding_url
  #
  #   click_on "Create Form response"
  #
  #   assert_text "Form response was successfully created"
  #   assert_selector "h1", text: "Form Responses"
  # end
  #
  # test "sequential forces forms to be submitted in order" do
  #   @dynamic_form.sequential = true
  #   @dynamic_form.save
  #
  #   visit onboarding_url
  #   click_on "form section two"
  # end
end
