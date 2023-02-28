require "application_system_test_case"

class DynamicFormsTest < ApplicationSystemTestCase
  setup do
    @user = users(:one)
    login_as @user
  end

  class NonsequentialDynamicFormsTest < DynamicFormsTest
    setup do
      @dynamic_form = dynamic_forms(:one)
    end

    test "visiting the index" do
      visit dynamic_forms_url
      assert_selector "h1", text: "Dynamic Forms"
    end

    test "creating a Dynamic form" do
      visit dynamic_forms_url
      click_on "New Dynamic Form"

      fill_in "Model", with: @dynamic_form.model
      fill_in "Use case", with: @dynamic_form.use_case
      click_on "Create Dynamic form"

      assert_text "Dynamic form was successfully created"
      assert_selector "p", text: @dynamic_form.use_case

      fill_in "Title", with: "My Form Config"
      click_on "Create Form config"
      assert_text "Form config was successfully created."

      click_on "My Form Config"
      fill_in "Title/Question/description/header thing", with: "New Field"
      fill_in "Eventable action", with: "New Eventable Action"
      click_on "Create Field config"
      assert_text "Field config was successfully created."

      # click_on @dynamic_form.use_case
      first(".text-xl").click_link(@dynamic_form.use_case)
      assert_text "My Form Config"

      assert_text "Add a Form Section"
      check("form_response_field_responses_attributes_0_response")
    end

    test "updating a Dynamic form" do
      visit dynamic_form_url(@dynamic_form)
      click_on "Edit", match: :first

      fill_in "Model", with: @dynamic_form.model
      fill_in "Use case", with: @dynamic_form.use_case
      click_on "Update Dynamic form"

      assert_text "Dynamic form was successfully updated"
      assert_selector "p", text: @dynamic_form.use_case
    end

    test "destroying a Dynamic form" do
      visit edit_dynamic_form_url(@dynamic_form)
      click_on "Delete", match: :first
      click_on "Confirm"

      assert_text "Dynamic form was successfully destroyed"
    end
  end

  class SequentialDynamicFormsTest < DynamicFormsTest
    setup do
      @dynamic_form = dynamic_forms(:sequential)
    end

    test "navigating a sequential Dynamic form" do
      visit dynamic_form_url(@dynamic_form)

      # Assert presence of Tab One and Tab Two
      # They appear twice because the tabs are visible, as well as the links to edit the FormConfigs.
      assert_text "Tab One", count: 2
      assert_text "Tab Two", count: 2
      # Assert presence of Tab One's content
      assert_text "Mysequentialquestion1"
      # Click on Tab Two <div>, not <a> tag
      find(:css, "div.cursor-not-allowed").click
      # Assert continued presence of Tab One's content
      assert_text "Mysequentialquestion1", count: 1
      # Assert absence of Tab Two's content
      assert_text "Mysequentialquestion2", count: 0

      # TODO:
      # These would also be nice, but you can't do this from the dynamic_forms Show page
      # It will have to be tested when we actually have a page that uses a sequential form
      # Fill in field and save
      # fill_in "Mysequentialquestion1", with: "MyString"
      # Make sure Tab Two's content is visible now, and not Tab One's
      # Do something here...
    end
  end
end
