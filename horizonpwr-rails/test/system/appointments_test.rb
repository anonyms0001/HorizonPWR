require "application_system_test_case"

class AppointmentsTest < ApplicationSystemTestCase
  setup do
    @appointment = appointments(:one)
    @site_audit = appointments(:two)
    @user = users(:one)
    login_as @user
  end

  test "visiting the index" do
    visit appointments_url
    assert_selector "a", text: "DATE"
  end

  test "creating an Appointment" do
    skip # NOTE: These are not created directly. They are created when Canvass sends data to our webhook.
    visit appointments_url
    click_on "New Appointment"

    fill_in "Appointment type", with: @appointment.appointment_type
    fill_in "Date", with: @appointment.date
    check "Quality sit" if @appointment.quality_sit
    fill_in "Source", with: @appointment.source
    click_on "Create Appointment"

    assert_text "Appointment was successfully created"
    assert_selector "h1", text: "Appointments"
  end

  # NOTE: No edit link should appear for consult appointments.
  test "not updating a consult Appointment" do
    @user.update!(job_position: job_positions(:support))
    @user.save!

    visit appointment_url(@appointment)
    assert has_no_field? "Edit", match: :first
  end

  # NOTE: You should only be able to edit appointments that are not a consult.
  test "updating an Appointment Site Audit Completed At date" do
    @user.update!(job_position: job_positions(:support))
    @user.save!

    visit appointment_url(@site_audit)
    click_on "Edit", match: :first

    # Select the Received at date from the flatpickr.
    find("input.flatpickr-capybara-selector").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    click_on "Update Appointment"

    assert_text "Appointment was successfully updated"
  end

  test "updating an Appointment status" do
    visit appointment_url(@site_audit)
    click_on "Edit", match: :first

    select("completed", from: "appointment_appointment_status")
    click_on "Update Appointment"

    assert_text "Appointment was successfully updated"
    assert_selector "#appt_status", text: "Completed"
  end

  test "marking an Appointment's paneling install as complete" do
    logout
    @user = users(:solar_installer)
    login_as @user
    @user.permissions["can_manage_appointments"] = true
    @user.save

    @paneling_install = appointments(:three)
    visit appointment_url(@paneling_install)
    click_on "Paneling Incomplete"

    assert_text "Paneling completed."
  end

  test "destroying an Appointment" do
    visit edit_appointment_url(@appointment)
    assert has_no_field? "Delete", match: :first
  end
end
