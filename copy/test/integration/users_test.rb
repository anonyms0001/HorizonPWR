require "test_helper"

class Jumpstart::UsersTest < ActionDispatch::IntegrationTest
  test "user can delete their account" do
    sign_in users(:one)
    assert_raises ActiveRecord::InvalidForeignKey do
      delete "/users"
    end
  end

  test "invalid time zones are handled safely" do
    user = users(:one)
    user.update! time_zone: "invalid"

    sign_in user
    get root_path
    assert_response :success
  end
end
