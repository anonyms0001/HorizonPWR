require "application_system_test_case"

class ReferralsTest < ApplicationSystemTestCase
  setup do
    @referral = referrals(:one)
    @user = users(:one)
    @user.permissions["can_manage_referrals"] = true
    @user.save!
    login_as @user
  end

  test "visiting the index" do
    visit referrals_url
    assert_selector "a", text: "Referrals"
  end

  test "creating a Referral" do
    visit referrals_url
    click_on "New Referral"

    fill_in "First Name", with: @referral.first_name
    fill_in "Last Name", with: @referral.last_name
    fill_in "Phone", with: @referral.phone
    fill_in "Email", with: @referral.email
    fill_in "Referrer first name", with: @referral.referrer_first_name
    fill_in "Referrer last name", with: @referral.referrer_last_name
    fill_in "Referrer address", with: @referral.referrer_address
    fill_in "Referrer phone", with: @referral.referrer_phone
    fill_in "Referrer email", with: @referral.referrer_email
    click_on "Submit Referral"

    assert_text "Hey! Thanks for the referral!"
  end

  test "updating a Referral" do
    visit referral_url(@referral)
    click_on "Edit", match: :first

    fill_in "First Name", with: @referral.first_name
    fill_in "Last Name", with: @referral.last_name
    fill_in "Phone", with: @referral.phone
    fill_in "Email", with: @referral.email
    fill_in "Referrer first name", with: @referral.referrer_first_name
    fill_in "Referrer last name", with: @referral.referrer_last_name
    fill_in "Referrer address", with: @referral.referrer_address
    fill_in "Referrer phone", with: @referral.referrer_phone
    fill_in "Referrer email", with: @referral.referrer_email
    click_on "Submit Referral"

    assert_text "Referral was successfully updated"
  end

  test "destroying a Referral" do
    visit edit_referral_url(@referral)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Referral was successfully destroyed"
  end
end
