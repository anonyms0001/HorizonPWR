require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
  end

  test "should get index" do
    login_as @user
    get users_url
    assert_response :success
  end

  test "should get show" do
    login_as @user, scope: :user, active: true, admin: true
    get user_url(@user)
    assert_response :success
  end

  test "cannot delete user with accounts" do
    login_as @user

    assert_raises ActiveRecord::InvalidForeignKey do
      delete "/users"
    end
    # assert_no_difference "User.count" do
    #   delete "/users"
    # end
  end
end
