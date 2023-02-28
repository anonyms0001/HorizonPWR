require "test_helper"

class ConcessionsControllerTest < ActionDispatch::IntegrationTest
  class WithoutPermissionsConcessionsControllerTest < ConcessionsControllerTest
    setup do
      @concession = concessions(:one)
      @user = users(:one)
      login_as @user
    end

    test "should not get index" do
      get concessions_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get new_concession_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create concession" do
      assert_no_difference("Concession.count") do
        post concessions_url, params: {concession: {amount: @concession.amount, project_id: @concession.project_id}}
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show concession" do
      get concession_url(@concession)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_concession_url(@concession)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not update concession" do
      patch concession_url(@concession), params: {concession: {amount: @concession.amount, project_id: @concession.project_id}}
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy concession" do
      assert_no_difference("Concession.count") do
        delete concession_url(@concession)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end
  end

  class WithPermissionsConcessionsControllerTest < ConcessionsControllerTest
    setup do
      @concession = concessions(:one)
      @user = users(:one)
      login_as @user
      @user.permissions["can_manage_concessions"] = true
      @user.save
    end

    test "should get index" do
      get concessions_url
      assert_response :success
    end

    test "should get new" do
      get new_concession_url
      assert_response :success
    end

    test "should create concession" do
      assert_difference("Concession.count") do
        post concessions_url, params: {concession: {amount: @concession.amount, project_id: @concession.project_id}}
      end

      assert_redirected_to concession_url(Concession.last)
    end

    test "should show concession" do
      get concession_url(@concession)
      assert_response :success
    end

    test "should get edit" do
      get edit_concession_url(@concession)
      assert_response :success
    end

    # TODO: Fix these once concessions are done and working.
    test "should update concession" do
      skip
      patch concession_url(@concession), params: {concession: {amount: @concession.amount, project_id: @concession.project_id}}
      assert_redirected_to concession_url(@concession)
    end

    # TODO: Fix these once concessions are done and working.
    test "should destroy concession" do
      skip
      assert_difference("Concession.count", -1) do
        delete concession_url(@concession)
      end

      assert_redirected_to concessions_url
    end
  end
end
