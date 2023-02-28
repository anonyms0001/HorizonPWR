require "test_helper"

class ContactAppointmentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @contact_appointment = contact_appointments(:one)
  end

  # test "should get index" do
  #   get contact_appointments_url
  #   assert_response :success
  # end
  #
  # test "should get new" do
  #   get new_contact_appointment_url
  #   assert_response :success
  # end
  #
  # test "should create contact_appointment" do
  #   assert_difference("ContactAppointment.count") do
  #     post contact_appointments_url, params: {contact_appointment: {appointment_id: @contact_appointment.appointment_id, contact_id: @contact_appointment.contact_id, project_id: @contact_appointment.project_id}}
  #   end
  #
  #   assert_redirected_to contact_appointment_url(ContactAppointment.last)
  # end
  #
  # test "should show contact_appointment" do
  #   get contact_appointment_url(@contact_appointment)
  #   assert_response :success
  # end
  #
  # test "should get edit" do
  #   get edit_contact_appointment_url(@contact_appointment)
  #   assert_response :success
  # end
  #
  # test "should update contact_appointment" do
  #   patch contact_appointment_url(@contact_appointment), params: {contact_appointment: {appointment_id: @contact_appointment.appointment_id, contact_id: @contact_appointment.contact_id, project_id: @contact_appointment.project_id}}
  #   assert_redirected_to contact_appointment_url(@contact_appointment)
  # end
  #
  # test "should destroy contact_appointment" do
  #   assert_difference("ContactAppointment.count", -1) do
  #     delete contact_appointment_url(@contact_appointment)
  #   end
  #
  #   assert_redirected_to contact_appointments_url
  # end
end
