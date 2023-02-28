require "test_helper"

class Jumpstart::AccountUsersTest < ActionDispatch::IntegrationTest
  setup do
    @account_admin = account_users(:account_admin)
    @account = @account_admin.account
    @account_admin_user = @account_admin.user
    @regular_user = users(:two)
  end

  class AdminUsers < Jumpstart::AccountUsersTest
    setup do
      sign_in @account_admin_user
    end

    test "can view account users" do
      get account_path(@account)
      assert_select "p", @account.name
      # assert_select "a", text: I18n.t("accounts.show.edit_account"), count: 1
      # assert_select "a", text: I18n.t("accounts.show.edit"), count: @account.account_users.count + @account.account_invitations.count
      # assert_select "a", text: I18n.t("accounts.show.invite"), count: 1
    end

    test "can edit account user" do
      account_user = account_users(:account_regular_user)
      get edit_account_account_user_path(@account, account_user)
      assert_select "button", "Update Account user"
    end

    test "can update account user" do
      account_user = account_users(:account_regular_user)
      put account_account_user_path(@account, account_user), params: {account_user: {admin: "1"}}
      assert_response :redirect
      assert account_user.reload.admin?
    end

    test "can delete account users" do
      user = users(:two)
      user = @account.account_users.find_by(user: user)
      delete account_account_user_path(@account, user.id)
      assert_response :redirect
      follow_redirect!
      assert_equal "User was removed from impersonal team", flash[:notice]
    end

    test "disables admin role checkbox when editing owner" do
      account_user = account_users(:account_admin)
      get edit_account_account_user_path(@account, account_user)
      assert_select "input[type=checkbox][name='account_user[admin]'][disabled]", 1
    end
  end

  class RegularUsers < Jumpstart::AccountUsersTest
    setup do
      sign_in @regular_user
    end

    test "can view account users but not edit" do
      get account_path(@account)
      assert_select "p", @account.name

      assert_select "a", text: I18n.t("accounts.show.edit_account"), count: 0
      assert_select "a", text: I18n.t("accounts.show.edit"), count: 0
      assert_select "a", text: "Invite A Account Member", count: 0
    end

    test "Regular user cannot view account user page" do
      get account_account_user_path(@account, @account_admin)
      assert_redirected_to account_path(@account)
    end

    test "Regular user cannot edit regular account users" do
      account_user = @account.account_users.find_by(user: @regular_user)
      get edit_account_account_user_path(@account, account_user)
      assert_redirected_to root_path
      assert_equal I18n.t("must_have_permissions"), flash[:alert]
    end

    test "Regular user cannot edit admin account users" do
      account_user = @account.account_users.find_by(user: @account_admin_user)
      get edit_account_account_user_path(@account, account_user)
      assert_redirected_to root_path
      assert_equal I18n.t("must_have_permissions"), flash[:alert]
    end

    test "Regular user cannot update themselves" do
      account_user = @account.account_users.find_by(user: @regular_user)
      put account_account_user_path(@account, account_user), params: {admin: "1"}
      assert_redirected_to root_path
      assert_equal I18n.t("must_have_permissions"), flash[:alert]
    end

    test "Regular user cannot update admin users" do
      account_user = @account.account_users.find_by(user: @account_admin_user)
      put account_account_user_path(@account, account_user), params: {admin: "0"}
      assert_redirected_to root_path
      assert_equal I18n.t("must_have_permissions"), flash[:alert]
    end

    # TODO: While I think the button is only displayed for Sales Managers, we should block them from even being able to
    #       do this, to prevent accidents/malicious acts.
    test "Regular user cannot delete account users" do
      skip
      user = users(:one)
      account_user = @account.account_users.find_by(user: user)
      assert_raises AbstractController::ActionNotFound do
        delete account_account_user_path(@account, account_user.id)
      end
      # assert_redirected_to account_path(@account)
      # assert_includes @account.account_users.pluck(:user_id), user.id
    end
  end
end
