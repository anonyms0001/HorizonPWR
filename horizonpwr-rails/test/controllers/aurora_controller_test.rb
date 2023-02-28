require "test_helper"

class AuroraControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionAuroraControllerTestt < AuroraControllerTest
    setup do
      VCR.insert_cassette(name)
      @user = users(:admin)
      @employee = users(:three)
      sign_in @user
    end

    teardown do
      VCR.eject_cassette
    end

    test "should generate an aurora_user_id" do
      get edit_user_path(@employee)
      assert_select "body", /Add to Aurora/
      assert_nil @employee.aurora_user_id

      post add_to_aurora_path, params: {user_id: @employee.id}

      assert_redirected_to edit_user_path(@employee)
      follow_redirect!

      assert_select "body", /An Aurora ID has been created for this user./
    end

    test "should deactivate an aurora_user_id" do
      skip
      get edit_user_path(@employee)
      assert_select "body", /Add to Aurora/

      post deactivate_aurora_path, params: {user_id: @employee.id}

      assert_redirected_to edit_user_path(@employee)
      follow_redirect!

      # assert_select "body", /An Aurora ID has been created for this user./
      # assert_not_nil @employee.aurora_user_id
      assert_select "body", /Deactivate Aurora/
    end

    test "should reactivate an aurora_user_id" do
      skip
      get edit_user_path(@employee)
      assert_select "body", /Add to Aurora/

      post add_to_aurora_path, params: {user_id: @employee.id}

      assert_redirected_to edit_user_path(@employee)
      follow_redirect!

      # assert_select "body", /An Aurora ID has been created for this user./
      # assert_not_nil @employee.aurora_user_id
      assert_select "body", /Deactivate Aurora/
    end
  end
end
