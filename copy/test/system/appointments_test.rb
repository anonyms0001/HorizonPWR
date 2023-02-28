require "application_system_test_case"

class AppointmentsTest < ApplicationSystemTestCase
  setup do
    @appointment = appointments(:one)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit appointments_url
    assert_selector "a", text: "DATE"
  end

  # test "creating a Appointment" do
  #   visit appointments_url
  #   click_on "New Appointment"
  #
  #   fill_in "Appointment type", with: @appointment.appointment_type
  #   fill_in "Date", with: @appointment.date
  #   check "Quality sit" if @appointment.quality_sit
  #   fill_in "Source", with: @appointment.source
  #   click_on "Create Appointment"
  #
  #   assert_text "Appointment was successfully created"
  #   assert_selector "h1", text: "Appointments"
  # end

  test "updating an Appointment date" do
    visit appointment_url(@appointment)
    click_on "Edit", match: :first

    # Flatpickr Alt Input field causes selector/validation/styling issues #2428 https://github.com/flatpickr/flatpickr/issues/2428
    find("input.flatpickr-capybara-selector").fill_in(with: @appointment.date)

    find("h3").click
    click_on "Update Appointment"

    assert_text "Appointment was successfully updated"
  end

  test "updating an Appointment status" do
    visit appointment_url(@appointment)
    click_on "Edit", match: :first

    # find("option[value='completed']").select_option
    select("completed", from: "appointment_appointment_status")
    click_on "Update Appointment"

    assert_text "Appointment was successfully updated"
    assert_selector "#appt_status", text: "Completed"
  end

  test "destroying a Appointment" do
    visit edit_appointment_url(@appointment)
    click_on "Delete", match: :first
  end
end
