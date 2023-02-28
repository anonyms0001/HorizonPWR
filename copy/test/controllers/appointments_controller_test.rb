require "test_helper"

class AppointmentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @appointment = appointments(:one)
    @user = users(:one)
    login_as @user, scope: :user
  end

  test "should get index" do
    get appointments_url
    assert_response :success
  end

  test "should get new" do
    get new_appointment_url
    assert_response :success
  end

  test "should create appointment" do
    assert_difference("Appointment.count") do
      post appointments_url, params: {
        appointment: {
          appointment_type: @appointment.appointment_type,
          date: @appointment.date,
          source: @appointment.source,
          consult_appointment_id: @appointment.id
        }
      }
    end
  end

  test "should show appointment" do
    get appointment_url(@appointment)
    assert_response :success
  end

  test "should get edit" do
    get edit_appointment_url(@appointment)
    assert_response :success
  end

  test "should update appointment" do
    patch appointment_url(@appointment), params: {appointment: {appointment_type: @appointment.appointment_type, date: @appointment.date, source: @appointment.source, account: @appointment.account}}
    assert_redirected_to appointment_url(@appointment)
  end
end
