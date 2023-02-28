require "test_helper"

class CanvassControllerTest < ActionDispatch::IntegrationTest
  # test "should get note" do
  #   post canvass_note_url
  #   assert_response :success
  # end

  test "should create an appointment for the rexburg team for a new user added in canvass that is not in that team on pwrstation" do
    account_users(:willard_user)
    # users(:willard)
    # accounts(:impersonal)

    params = fake_event "canvass/appointment_created"

    assert_difference(["Appointment.count", "Contact.count", "Address.count"]) do
      post canvass_appointment_url, params: params
    end
  end

  test "should create sanitized address when creating appointment request" do
    params = fake_event "canvass/appointment_created"
    post "/canvass/appointment", params: params

    assert_equal Address.last.address, "237 North 2nd East Street Rexburg, ID 83440"
  end

  # test "should not get appointment" do
  #   get canvass_appointment_url
  #   assert_response :fail
  # end
  #
  # test "should not get interaction" do
  #   get canvass_interaction_url
  #   assert_response :fail
  # end
end
