require "application_system_test_case"

class EnergyConsumptionsTest < ApplicationSystemTestCase
  setup do
    @proposal = proposals(:one)
    @energy_consumption = energy_consumptions(:three)
    @user = users(:one)
    login_as @user
    @user.permissions["can_manage_energy_consumptions"] = true
    @user.save
  end

  test "creating a Energy consumption" do
    visit new_proposal_energy_consumption_url(@proposal)

    fields = all("input[id=energy_consumption_monthly_usage]")
    fields.each do |field|
      field.fill_in(with: "750")
    end

    click_on "Update Energy Consumption"

    assert_text "Energy consumption was successfully created"
  end

  test "updating a Energy consumption" do
    visit edit_proposal_energy_consumption_url(@proposal, @proposal.energy_consumption)

    fields = all("input[id=energy_consumption_monthly_usage]")
    fields.each do |field|
      field.fill_in(with: "750")
    end

    click_on "Update Energy Consumption"

    assert_text "Energy consumption was successfully updated"
  end

  test "destroying a Energy consumption" do
    skip
    visit edit_proposal_energy_consumption_url(@proposal, @energy_consumption)
    click_on "Delete", match: :first
    click_on "Confirm"

    assert_text "Energy consumption was successfully destroyed"
  end
end
