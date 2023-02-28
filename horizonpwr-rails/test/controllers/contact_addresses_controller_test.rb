require "test_helper"

class ContactAddressesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @contact_address = project_contact_addresses(:one)
    @user = users(:one)
    login_as @user, scope: :user
  end

  # test "should get index" do
  #   get contactAddresses_url
  #   assert_response :success
  # end
  #
  # test "should get new" do
  #   get new_contactAddress_url
  #   assert_response :success
  # end
  #
  # test "should create contact_address" do
  #   assert_difference("ContactAddress.count") do
  #     post contactAddresses_url, params: { contact_address: { appointment_id: @contact_address.appointment_id, contact_id: @contact_address.contact_id, primary_contact: @contact_address.primary_contact, project_id: @contact_address.project_id}}
  #   end
  #
  #   assert_redirected_to contactAddress_url(ContactAddress.last)
  # end
  #
  # test "should show contact_address" do
  #   get contactAddress_url(@contact_address)
  #   assert_response :success
  # end
  #
  # test "should get edit" do
  #   get edit_contactAddress_url(@contact_address)
  #   assert_response :success
  # end
  #
  # test "should update contact_address" do
  #   patch contactAddress_url(@contact_address), params: { contact_address: { appointment_id: @contact_address.appointment_id, contact_id: @contact_address.contact_id, primary_contact: @contact_address.primary_contact, project_id: @contact_address.project_id}}
  #   assert_redirected_to contactAddress_url(@contact_address)
  # end
  #
  # test "should destroy contact_address" do
  #   assert_difference("ContactAddress.count", -1) do
  #     delete contactAddress_url(@contact_address)
  #   end
  #
  #   assert_redirected_to contactAddresses_url
  # end
end
