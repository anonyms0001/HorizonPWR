require "test_helper"

class ReferralsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @referral = referrals(:one)
    @user = users(:one)
    login_as @user
    @user.permissions["can_manage_referrals"] = true
    @user.save
  end

  test "should get index" do
    get referrals_url
    assert_response :success
  end

  test "should get new" do
    get new_referral_url
    assert_response :success
  end

  # TODO: Needs a webmock for ActiveCampaign
  # NoMethodError: undefined method `[]' for nil:NilClass
  # from /Users/admin/workspace/horizonpwr-rails/app/models/active_campaign_client.rb:6:in `initialize'
  test "should create referral" do
    skip
    assert_difference("Referral.count") do
      post referrals_url, params: {referral: {contest_id: @referral.contest_id,
                                              eligible: @referral.eligible,
                                              email: @referral.email,
                                              first_name: @referral.first_name,
                                              last_name: @referral.last_name,
                                              phone: @referral.phone,
                                              referral_contact_id: @referral.referral_contact_id,
                                              referrer_contact_id: @referral.referrer_contact_id,
                                              status: @referral.status}}
    end

    assert_redirected_to referral_url(Referral.last)
  end

  test "should show referral" do
    get referral_url(@referral)
    assert_response :success
  end

  test "should get edit" do
    get edit_referral_url(@referral)
    assert_response :success
  end

  test "should update referral" do
    patch referral_url(@referral),
      params: {referral: {contest_id: @referral.contest_id,
                          eligible: @referral.eligible,
                          email: @referral.email,
                          first_name: @referral.first_name,
                          last_name: @referral.last_name,
                          phone: @referral.phone,
                          referral_contact_id: @referral.referral_contact_id,
                          referrer_contact_id: @referral.referrer_contact_id,
                          status: @referral.status}}
    assert_redirected_to referral_url(@referral)
  end

  # TODO: Fix this:
  # Error:
  # ReferralsControllerTest#test_should_destroy_referral:
  # ActiveRecord::StatementInvalid: PG::UndefinedColumn: ERROR:  column contacts.referral_id does not exist
  # LINE 1: UPDATE "contacts" SET "referral_id" = $1 WHERE "contacts"."r...
  #                                                        ^
  #
  #     app/controllers/referrals_controller.rb:91:in `destroy'
  test "should destroy referral" do
    skip
    assert_difference("Referral.count", -1) do
      delete referral_url(@referral)
    end

    assert_redirected_to referrals_url
  end
end
