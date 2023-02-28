require "test_helper"

class EnergyConsumptionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @proposal = proposals(:three)
    @energy_consumption = energy_consumptions(:one)
    @user = users(:one)
    login_as @user
    @user.permissions["can_manage_energy_consumptions"] = true
    @user.save
  end

  test "should not get index" do
    assert_raises NameError do
      get energy_consumptions_url
    end
    assert_raises ActionController::RoutingError do
      get "/energy_consumptions"
    end
  end

  test "should get new" do
    get new_proposal_energy_consumption_url(@proposal)
    assert_response :success
  end

  test "should create energy_consumption with monthly usage" do
    assert_difference("EnergyConsumption.count") do
      post proposal_energy_consumptions_url(@proposal), params: {
        energy_consumption: {
          # created_by_id: @energy_consumption.created_by_id,
          # data_source: @energy_consumption.data_source,
          daily_usage: ["", "", "", "", "", "", "", "", "", "", "", ""],
          monthly_usage: [777, 777, 777, 777, 777, 777, 777, 777, 777, 777, 777, 777]
          # proposal_id: @proposal.id,
          # updated_by_id: @energy_consumption.updated_by_id
        }
      }
    end

    assert_redirected_to @proposal
  end

  test "should create energy_consumption with daily usage" do
    assert_difference("EnergyConsumption.count") do
      post proposal_energy_consumptions_url(@proposal), params: {
        energy_consumption: {
          # created_by_id: @energy_consumption.created_by_id,
          # data_source: @energy_consumption.data_source,
          daily_usage: @energy_consumption.daily_usage,
          monthly_usage: ["", "", "", "", "", "", "", "", "", "", "", ""]
          # proposal_id: @energy_consumption.proposal_id,
          # updated_by_id: @energy_consumption.updated_by_id
        }
      }
    end

    assert_redirected_to @proposal
  end

  test "should create energy_consumption with monthly usage with nil value" do
    assert_difference("EnergyConsumption.count") do
      post proposal_energy_consumptions_url(@proposal), params: {
        energy_consumption: {
          # created_by_id: @energy_consumption.created_by_id,
          # data_source: @energy_consumption.data_source,
          daily_usage: ["", "", "", "", "", "", "", "", "", "", "", ""],
          monthly_usage: [777, 777, 777, 777, 777, 777, 777, 777, 777, 777, 777, ""]
          # proposal_id: @energy_consumption.proposal_id,
          # updated_by_id: @energy_consumption.updated_by_id
        }
      }
    end

    assert_redirected_to @proposal
    assert_not_equal [777, 777, 777, 777, 777, 777, 777, 777, 777, 777, 777, ""], @proposal.energy_consumption.monthly_usage
  end

  test "should not create energy_consumption if monthly and daily usage provided" do
    assert_no_difference("EnergyConsumption.count") do
      post proposal_energy_consumptions_url(@proposal), params: {
        energy_consumption: {
          # created_by_id: @energy_consumption.created_by_id,
          # data_source: @energy_consumption.data_source,
          daily_usage: @energy_consumption.daily_usage,
          monthly_usage: @energy_consumption.monthly_usage
          # proposal_id: @energy_consumption.proposal_id,
          # updated_by_id: @energy_consumption.updated_by_id
        }
      }
    end

    assert_redirected_to new_proposal_energy_consumption_url(@proposal)
    follow_redirect!
    assert_select "body", /You cannot submit BOTH Monthly and Daily usage!/
  end

  test "should show energy_consumption" do
    assert_raises ActionController::RoutingError do
      get proposal_energy_consumption_url(@proposal, @energy_consumption)
    end
  end

  test "should get edit" do
    get edit_proposal_energy_consumption_url(@proposal, @energy_consumption)
    assert_response :success
  end

  test "should update energy_consumption" do
    @proposal = proposals(:one)
    patch proposal_energy_consumption_url(@proposal, @energy_consumption), params: {
      energy_consumption: {
        created_by_id: @energy_consumption.created_by_id,
        data_source: @energy_consumption.data_source,
        daily_usage: @energy_consumption.daily_usage,
        monthly_usage: ["775", "775", "775", "775", "775", "775", "775", "775", "775", "775", "775", "775"],
        proposal_id: @energy_consumption.proposal_id,
        updated_by_id: @energy_consumption.updated_by_id
      }
    }
    assert_redirected_to edit_proposal_energy_consumption_url(@proposal, @energy_consumption)
  end

  test "should destroy energy_consumption" do
    assert_difference("EnergyConsumption.count", -1) do
      delete proposal_energy_consumption_url(@proposal, @energy_consumption)
    end

    assert_redirected_to @proposal
  end
end
