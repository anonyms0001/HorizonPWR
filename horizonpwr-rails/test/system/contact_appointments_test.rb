require "application_system_test_case"

class ContactAppointmentsTest < ApplicationSystemTestCase
  setup do
    @contact_appointment = contact_appointments(:one)
  end

  # test "visiting the index" do
  #   visit contact_appointments_url
  #   assert_selector "h1", text: "Contact Appointments"
  # end
  #
  # test "creating a Contact appointment" do
  #   visit contact_appointments_url
  #   click_on "New Contact Appointment"
  #
  #   fill_in "Appointment", with: @contact_appointment.appointment_id
  #   fill_in "Contact", with: @contact_appointment.contact_id
  #   fill_in "Project", with: @contact_appointment.project_id
  #   click_on "Create Contact appointment"
  #
  #   assert_text "Contact appointment was successfully created"
  #   assert_selector "h1", text: "Contact Appointments"
  # end
  #
  # test "updating a Contact appointment" do
  #   visit contact_appointment_url(@contact_appointment)
  #   click_on "Edit", match: :first
  #
  #   fill_in "Appointment", with: @contact_appointment.appointment_id
  #   fill_in "Contact", with: @contact_appointment.contact_id
  #   fill_in "Project", with: @contact_appointment.project_id
  #   click_on "Update Contact appointment"
  #
  #   assert_text "Contact appointment was successfully updated"
  #   assert_selector "h1", text: "Contact Appointments"
  # end
  #
  # test "destroying a Contact appointment" do
  #   visit edit_contact_appointment_url(@contact_appointment)
  #   click_on "Delete", match: :first
  #   click_on "Confirm"
  #
  #   assert_text "Contact appointment was successfully destroyed"
  # end
end
