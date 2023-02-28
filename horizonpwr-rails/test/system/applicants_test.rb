require "application_system_test_case"

class ApplicantsTest < ApplicationSystemTestCase
  class WithPermissionsApplicantsTest < ApplicantsTest
    setup do
      @applicant = applicants(:one)
      @user = users(:one)
      login_as @user
      @user.permissions["can_manage_applicants"] = true
      @user.save
    end

    test "visiting the index" do
      visit applicants_url
      assert_selector "h1", text: "Applicants"
    end

    test "updating a Applicant" do
      visit applicant_url(@applicant)
      click_on "Edit", match: :first

      fill_in "Email", with: @applicant.email
      fill_in "Full name", with: @applicant.first_name + " " + @applicant.last_name
      fill_in "Phone", with: @applicant.phone
      # check "Previously employed here" if @applicant.previously_employed_here
      click_on "Update Applicant"

      assert_text "Applicant was successfully updated"
    end

    test "destroying a Applicant" do
      skip # We do not allow these to be destroyed.
      visit edit_applicant_url(@applicant)
      click_on "Delete", match: :first
      click_on "Confirm"

      assert_text "Applicant was successfully destroyed"
    end
  end

  class WithoutPermissionsApplicantsTest < ApplicantsTest
    setup do
      @applicant = applicants(:one)
    end

    test "creating a Applicant" do
      visit new_applicant_url

      fill_in "Email", with: @applicant.email
      fill_in "Full name", with: "Test Test"
      fill_in "Phone", with: @applicant.phone
      check "Previously employed here" if @applicant.previously_employed_here
      click_on "Create Applicant"

      assert_text "Application was successfully sent"
    end
  end
end
