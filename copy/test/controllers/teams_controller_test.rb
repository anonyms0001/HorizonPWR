require "test_helper"

class TeamsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @account = accounts(:one)
    @user = users(:one)
    login_as @user
  end

  test "should not get index" do
    get teams_url
    assert_redirected_to root_path
    assert_equal I18n.t("must_have_permissions"), flash[:alert]
  end

  test "should get show" do
    get team_url(@account)
    assert_response :success
  end
end
