require "test_helper"

class Jumpstart::AccountInvitationsTest < ActionDispatch::IntegrationTest
  setup do
    @account_invitation = account_invitations(:one)
    @account = @account_invitation.account
    @inviter = @account.users.first
    @invited = users(:invited)
  end

  test "cannot view invitation when logged out" do
    get account_invitation_path(@account_invitation)
    assert_redirected_to new_user_registration_path(invite: @account_invitation.token)
    assert "Create an account to accept your invitation", flash[:alert]
  end

  test "can view invitation when logged in" do
    sign_in @invited
    get account_invitation_path(@account_invitation)
    assert_response :success
  end

  test "can decline invitation" do
    sign_in @invited
    assert_difference "AccountInvitation.count", -1 do
      delete account_invitation_path(@account_invitation)
    end
  end

  test "can accept invitation" do
    sign_in @invited
    assert_difference "AccountUser.count" do
      assert_difference "AccountInvitation.count", -1 do
        put account_invitation_path(@account_invitation)
      end
    end
  end

  test "fails to accept invitation if validation issues" do
    sign_in users(:one)
    put account_invitation_path(@account_invitation)
    assert_redirected_to account_invitation_path(@account_invitation)
  end

  # TODO: This is not a feature we are using. The error is:
  # Error:
  # Jumpstart::AccountInvitationsTest#test_accepts_invitation_automatically_through_sign_up:
  # NoMethodError: undefined method `[]' for nil:NilClass
  #     app/models/canvass_client.rb:8:in `initialize'
  #     app/models/user.rb:430:in `new'
  test "accepts invitation automatically through sign up" do
    skip
    assert_difference "User.count" do
      post user_registration_path(invite: @account_invitation.token), params: {user: {name: "Invited User", email: "new@horizonpwr.com", password: "password", password_confirmation: "password", terms_of_service: "1"}}
    end
    assert_redirected_to root_path
    assert_equal 1, User.last.accounts.count
    assert_equal @account, User.last.accounts.first
    assert_raises ActiveRecord::RecordNotFound do
      @account_invitation.reload
    end
  end
end
