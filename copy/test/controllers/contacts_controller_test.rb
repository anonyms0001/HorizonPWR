require "test_helper"

class ContactsControllerTest < ActionDispatch::IntegrationTest
  class RegularUserContactsControllerTest < ContactsControllerTest
    setup do
      @contact = contacts(:one)
      @user = users(:one)
      login_as @user
    end

    test "should get index" do
      get contacts_url
      assert_response :success
    end

    test "should get new" do
      get new_contact_url
      assert_response :success
    end

    test "should show contact" do
      get contact_url(@contact)
      assert_response :success
    end

    test "should get edit" do
      get edit_contact_url(@contact)
      assert_response :success
    end

    test "should update contact" do
      patch contact_url(@contact), params: {contact: {email: @contact.email, first_name: @contact.first_name, last_name: @contact.last_name, phone: @contact.phone}}
      assert_redirected_to contact_url(@contact)
    end

    test "non-admin should not destroy contact" do
      delete contact_url(@contact)
      assert_redirected_to root_url
      follow_redirect!
      assert_equal I18n.t("must_have_permissions"), flash[:alert]
    end

    test "non-admin with permissions should destroy contact" do
      @user.update(permissions: {can_manage_contacts: true})
      delete contact_url(@contact)
      assert_redirected_to contacts_url
      follow_redirect!
      assert_equal "Contact was successfully destroyed.", flash[:notice]
    end
  end

  class AdminContactsControllerTest < ContactsControllerTest
    setup do
      @contact = contacts(:one)
      @user = users(:admin)
      login_as @user
    end

    test "admin should destroy contact" do
      assert_difference("Contact.count", -1) do
        delete contact_url(@contact)
      end

      assert_redirected_to contacts_url
    end
  end
end
