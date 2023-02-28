require "test_helper"

class InstallersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @installer = installers(:one)
    @project = projects(:one)
    @user = users(:two)
    @user.update(permissions: {can_manage_installers: true})
    login_as @user, scope: :user
  end

  test "should get index" do
    get installers_url
    assert_response :success
  end

  test "should get new" do
    get new_installer_url
    assert_response :success
  end

  test "should create installer" do
    assert_difference("Installer.count") do
      post installers_url, params: {installer: {active: @installer.active, name: @installer.name}}
    end

    assert_redirected_to installer_url(Installer.last)
  end

  test "should show installer" do
    get installer_url(@installer)
    assert_response :success
  end

  test "should get edit" do
    get edit_installer_url(@installer)
    assert_response :success
  end

  test "should update installer" do
    patch installer_url(@installer), params: {installer: {active: @installer.active, name: @installer.name}}
    assert_redirected_to installer_url(@installer)
  end

  test "should not_destroy installer" do
    # assert_difference("Installer.count", -1) do
    @user.update(admin: true)
    assert_raises ActiveRecord::InvalidForeignKey do
      delete installer_url(@installer)
    end

    # assert_redirected_to installers_url
  end

  test "should not destroy project" do
    # assert_difference("Project.count", 0) do
    @user.update(admin: true)
    assert_raises ActiveRecord::InvalidForeignKey do
      delete installer_url(@installer)
    end

    # assert_redirected_to installers_url
  end
end
