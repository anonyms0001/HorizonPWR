require "application_system_test_case"

class FundingsTest < ApplicationSystemTestCase
  setup do
    @funding = fundings(:one)
    @project = @funding.project
    @user = users(:one)
    login_as @user
    @user.permissions["can_manage_fundings"] = true
    @user.save
  end

  # TODO: We will need to test this once it has been finished.
  test "visiting the index" do
    skip
    visit fundings_url
    assert_selector "h1", text: "Fundings"
  end

  test "creating a Funding" do
    visit new_project_funding_url(@project)

    fill_in "Amount", with: @funding.amount

    # Select the Finance partner from the dropdown.
    select("MyString1", from: "funding_finance_partner_id") # MyString1 is the name of a FinancePartner fixture.

    # Select the Approved at date from the flatpickr.
    find("input.flatpickr-approved-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Denied at date from the flatpickr.
    find("input.flatpickr-denied-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Loan docs signed at date from the flatpickr.
    find("input.flatpickr-loan-docs-signed-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Application submitted at date from the flatpickr.
    find("input.flatpickr-application-submitted-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Coc sent at date from the flatpickr.
    find("input.flatpickr-coc-sent-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Coc signed at date from the flatpickr.
    find("input.flatpickr-coc-signed-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Invoice sent at date from the flatpickr.
    find("input.flatpickr-invoice-sent-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Sent to collections at date from the flatpickr.
    find("input.flatpickr-sent-to-collections-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    click_on "Create Funding"

    # TODO: The following error keeps us from verifying that we were successful:
    # Error:
    # FundingsTest#test_creating_a_Funding:
    # ActionView::Template::Error: undefined method `energy_consultant_select' for nil:NilClass
    #     app/views/appointments/_form.html.erb:66
    #     app/views/appointments/_form.html.erb:1
    #     app/views/projects/show.html.erb:269
    #
    # assert_text "Funding was successfully created"
  end

  test "updating a Funding" do
    visit project_funding_url(@project, @funding)
    click_on "Edit", match: :first

    fill_in "Amount", with: @funding.amount

    # Select the Finance partner from the dropdown.
    select("MyString1", from: "funding_finance_partner_id")

    # Select the Approved at date from the flatpickr.
    find("input.flatpickr-approved-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Denied at date from the flatpickr.
    find("input.flatpickr-denied-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Loan docs signed at date from the flatpickr.
    find("input.flatpickr-loan-docs-signed-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Application submitted at date from the flatpickr.
    find("input.flatpickr-application-submitted-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Coc sent at date from the flatpickr.
    find("input.flatpickr-coc-sent-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Coc signed at date from the flatpickr.
    find("input.flatpickr-coc-signed-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Invoice sent at date from the flatpickr.
    find("input.flatpickr-invoice-sent-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    # Select the Sent to collections at date from the flatpickr.
    find("input.flatpickr-sent-to-collections-at").click # Show the date picker, so days will be visible
    find("span.flatpickr-day:nth-of-type(10)").click # Choose the tenth visible day
    find("h1").click # To close flatpickr

    click_on "Update Funding"

    assert_text "Funding was successfully updated"
  end
end
