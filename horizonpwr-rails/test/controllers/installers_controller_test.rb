require "test_helper"

class InstallersControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionInstallersControllerTest < InstallersControllerTest
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

    test "should create installer with related account" do
      assert_difference("Installer.count") do
        post installers_url, params: {installer: {active: @installer.active, name: @installer.name}}
      end

      assert_redirected_to installer_url(Installer.last)
      # NOTE: A new impersonal account is created when an Installer is created, via the Installer model.
      #       They should have the same name.
      assert_equal Installer.last.name, Account.last.name
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

  class WithoutPermissionInstallersControllerTest < InstallersControllerTest
    setup do
      @installer = installers(:one)
      @project = projects(:one)
      @user = users(:nobody)
      login_as @user, scope: :user
    end

    test "should not get index" do
      get installers_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get new_installer_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create installer" do
      assert_no_difference("Installer.count") do
        post installers_url, params: {installer: {active: @installer.active, name: @installer.name}}
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show installer" do
      get installer_url(@installer)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_installer_url(@installer)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not update installer" do
      patch installer_url(@installer), params: {installer: {active: @installer.active, name: @installer.name}}
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not_destroy installer" do
      assert_no_difference("Installer.count") do
        delete address_url(@installer)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy project" do
      assert_no_difference("Project.count") do
        delete address_url(@project)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end
  end
end
