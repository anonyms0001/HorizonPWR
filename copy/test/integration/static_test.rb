require "test_helper"

class Jumpstart::StaticTest < ActionDispatch::IntegrationTest
  test "homepage" do
    get root_path
    assert_response :success
  end

  test "leaderboard" do
    sign_in users(:one)
    get root_path
    assert_select "p", I18n.t("dashboard.show.title")
  end
end
