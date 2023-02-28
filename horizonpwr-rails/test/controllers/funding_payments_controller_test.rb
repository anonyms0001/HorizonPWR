require "test_helper"

class FundingPaymentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @funding_payment = funding_payments(:one)
    @funding = @funding_payment.funding
    @project_id = @funding.project.id
    @user = users(:one)
    @user.permissions["can_manage_funding_payments"] = true
    @user.save!
    login_as @user
  end

  # NOTE: There is no FundingPayments index page. These are listed on the payment_funding_url page.
  test "should not get index" do
    assert_raises "ActionController::RoutingError" do
      get "/funding_payments"
    end
    # assert_response :success
  end

  test "should get new" do
    get new_project_funding_funding_payment_url(@project_id, @funding.id)
    assert_response :success
  end

  test "should create funding_payment" do
    assert_difference("FundingPayment.count") do
      post project_funding_funding_payments_url(@project_id, @funding.id), params: {
        funding_payment: {
          amount: @funding_payment.amount,
          received_at: @funding_payment.received_at,
          funding_id: fundings(:one).id,
          payment_type: @funding_payment.payment_type
        }
      }
    end

    assert_redirected_to project_funding_url(@project_id, @funding.id)
  end

  test "should not show funding_payment" do
    assert_raises "ActionController::RoutingError" do
      get project_funding_funding_payment_url(@project_id, @funding.id, @funding_payment.id)
    end
  end

  test "should get edit" do
    get edit_project_funding_funding_payment_url(@project_id, @funding.id, @funding_payment.id)
    assert_response :success
  end

  test "should update funding_payment" do
    patch project_funding_funding_payment_url(@project_id, @funding.id, @funding_payment.id), params: {
      funding_payment: {
        amount: @funding_payment.amount,
        received_at: @funding_payment.received_at,
        funding_id: fundings(:one).id
      }
    }
    assert_redirected_to project_funding_url(@project_id, @funding.id)
  end

  test "should destroy funding_payment" do
    assert_difference("FundingPayment.count", -1) do
      delete project_funding_funding_payment_url(@project_id, @funding.id, @funding_payment.id)
    end

    assert_redirected_to project_funding_url(@project_id, @funding.id)
  end
end
