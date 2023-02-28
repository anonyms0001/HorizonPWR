require "test_helper"

class Jumpstart::AccountsTest < ActionDispatch::IntegrationTest
  setup do
    @account_user = account_users(:account_admin)
    @account = @account_user.account
    @admin = @account_user.user
    @regular_user = users(:two)
  end

  # TODO: Add scoped tests for the following User types
  # DefaultManagerUser
  # ManagerUser

  class AdminUsers < Jumpstart::AccountsTest
    setup do
      sign_in @admin
    end

    test "can edit account" do
      get edit_account_path(@account)
      assert_response :success
      assert_select "button", "Update Account"
    end

    test "can update account" do
      put account_path(@account), params: {account: {name: "Test Account 2"}}
      assert_redirected_to account_path(@account)
      follow_redirect!
      assert_select "p", "Test Account 2"
    end

    test "can not delete account" do
      assert_raises ActionController::RoutingError do
        delete account_path(@account)
      end
      # TODO: should we redirect? What is the intended error experience?
      # assert_redirected_to accounts_path
      # assert_equal flash[:notice], I18n.t("accounts.destroyed")
    end

    test "cannot delete personal account" do
      account = @admin.personal_account
      assert_raises ActionController::RoutingError do
        delete account_path(account)
      end
    end
  end

  class RegularUsers < Jumpstart::AccountsTest
    setup do
      sign_in @regular_user
    end

    test "cannot edit account" do
      get edit_account_path(@account)
      assert_redirected_to account_path(@account)
    end

    test "cannot update account" do
      name = @account.name
      put account_path(@account), params: {account: {name: "Test Account Changed"}}
      assert_redirected_to account_path(@account)
      follow_redirect!
      assert_select "p", name
    end

    test "cannot delete account" do
      assert_raises ActionController::RoutingError do
        delete account_path(@account)
      end
    end
  end
end
