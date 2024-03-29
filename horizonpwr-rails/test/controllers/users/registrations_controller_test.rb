require "test_helper"

class Users::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  include InvisibleCaptcha

  setup do
    @user_params = {user:
                        {name: "Test User",
                         username: "new_testuser",
                         email: "user@horizonpwr.com",
                         password: "TestPassword",
                         terms_of_service: "1"}}

    # With this feature enabled, we also need to submit an account
    if Jumpstart.config.register_with_account?
      @user_params[:user][:owned_accounts_attributes] = [{name: "Test Account"}]
    end
  end

  class BasicRegistrationTest < Users::RegistrationsControllerTest
    test "successfully registration form render" do
      get new_user_registration_path
      assert_response :success
      assert response.body.include?("user[name]")
      assert response.body.include?("user[email]")
      assert response.body.include?("user[password]")
      assert response.body.include?(InvisibleCaptcha.sentence_for_humans)
    end

    # TODO: Looks like we need a webmock for Canvass:
    # Error:
    # Users::RegistrationsControllerTest::BasicRegistrationTest#test_successful_user_registration:
    # NoMethodError: undefined method `[]' for nil:NilClass
    #     app/models/canvass_client.rb:8:in `initialize'
    #     app/models/user.rb:430:in `new'
    test "successful user registration" do
      skip
      assert_difference "User.count" do
        post user_registration_url, params: @user_params
      end
    end

    test "failed user registration" do
      assert_no_difference "User.count" do
        post user_registration_url, params: {}
      end
    end
  end

  class InvibleCaptchaTest < Users::RegistrationsControllerTest
    # TODO: Looks like we need a webmock for Canvass:
    # Error:
    # Users::RegistrationsControllerTest::BasicRegistrationTest#test_successful_user_registration:
    # NoMethodError: undefined method `[]' for nil:NilClass
    #     app/models/canvass_client.rb:8:in `initialize'
    #     app/models/user.rb:430:in `new'
    test "honeypot is not filled and user creation succeeds" do
      skip
      assert_difference "User.count" do
        post user_registration_url, params: @user_params.merge(honeypotx: "")
      end
    end

    test "honeypot is filled and user creation fails" do
      assert_no_difference "User.count" do
        post user_registration_url, params: @user_params.merge(honeypotx: "spam")
      end
    end
  end

  class RegisterWithAccountTest < Users::RegistrationsControllerTest
    test "doesn't prompt for account details on sign up if disabled" do
      Jumpstart.config.stub(:register_with_account?, false) do
        get new_user_registration_path
        assert_no_match "Account name", response.body
      end
    end

    # test "prompts for account details on sign up if enabled" do
    #   Jumpstart.config.stub(:register_with_account?, true) do
    #     get new_user_registration_path
    #     assert_select "label", text: "Account name"
    #   end
    # end
  end
end
