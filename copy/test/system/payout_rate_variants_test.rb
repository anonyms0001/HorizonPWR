require "application_system_test_case"

class PayoutRateVariantsTest < ApplicationSystemTestCase
  setup do
    @payout_rate_variant = payout_rate_variants(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit payout_rate_variants_url
    assert_selector "h1", text: "Payout Rate Variants"
  end

  test "creating a Payout rate variant" do
    visit new_payout_rate_variant_url
    # click_on "New Payout Rate Variant"

    fill_in "Earning rate", with: @payout_rate_variant.earning_rate_id
    fill_in "Earning type", with: @payout_rate_variant.earning_type_id
    fill_in "Payout", with: @payout_rate_variant.payout_id
    click_on "Create Payout rate variant"

    assert_text "Payout rate variant was successfully created"
    assert_selector "h1", text: "Payout Rate Variants"
  end

  test "updating a Payout rate variant" do
    visit payout_rate_variant_url(@payout_rate_variant)
    click_on "Edit", match: :first

    fill_in "Earning rate", with: @payout_rate_variant.earning_rate_id
    fill_in "Earning type", with: @payout_rate_variant.earning_type_id
    fill_in "Payout", with: @payout_rate_variant.payout_id
    click_on "Update Payout rate variant"

    assert_text "Payout rate variant was successfully updated"
    assert_selector "h1", text: "Payout Rate Variants"
  end

  # NOTE: We are not destroying these.
  test "can not destroying a Payout rate variant" do
    visit edit_payout_rate_variant_url(@payout_rate_variant)
    assert has_no_field? "Delete", match: :first
  end
end
