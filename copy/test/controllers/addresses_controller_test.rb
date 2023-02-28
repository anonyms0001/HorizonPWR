require "test_helper"

class AddressesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @address = addresses(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get addresses_url
    assert_response :success
  end

  test "should get new" do
    get new_address_url
    assert_response :success
  end

  test "should create address" do
    assert_difference("Address.count") do
      post addresses_url, params: {address: {address: @address.address, address_type: @address.address_type, latitude: @address.latitude, longitude: @address.longitude}}
    end

    assert_redirected_to address_url(Address.last)
  end

  test "should show address" do
    get address_url(@address)
    assert_response :success
  end

  test "should get edit" do
    get edit_address_url(@address)
    assert_response :success
  end

  test "should update address" do
    patch address_url(@address), params: {address: {address: @address.address, address_type: @address.address_type, latitude: @address.latitude, longitude: @address.longitude}}
    assert_redirected_to address_url(@address)
  end

  test "should not destroy address" do
    assert_no_difference("Address.count") do
      delete address_url(@address)
    end

    assert_redirected_to addresses_url
    follow_redirect!
    assert_select "body", /You should not delete Addresses/
  end
end
