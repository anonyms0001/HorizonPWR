require "test_helper"

class FundingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @funding = fundings(:one)
    @user = users(:one)
    login_as @user
    @user.permissions["can_manage_fundings"] = true
  end

  # TODO: Fix: Projects currently have both a status column and status method, so funding.project.status returns nil.
  test "should get index" do
    skip
    get fundings_url
    assert_response :success
  end

  test "should get new" do
    get new_project_funding_url(@funding.project_id)
    assert_response :success
  end

  # NOTE: Fundings are not created directly like this.
  test "should create funding" do
    skip
    assert_difference("Funding.count") do
      post fundings_url, params: {
        funding: {
          amount: @funding.amount,
          application_submitted_at: @funding.application_submitted_at,
          approved_at: @funding.approved_at,
          coc_sent_at: @funding.coc_sent_at,
          coc_signed_at: @funding.coc_signed_at,
          denied_at: @funding.denied_at,
          invoice_sent_at: @funding.invoice_sent_at,
          loan_docs_signed_at: @funding.loan_docs_signed_at,
          project_id: @funding.project_id,
          finance_partner_id: finance_partners(:one).id
        }
      }
    end

    assert_redirected_to funding_url(Funding.last)
  end

  test "should show funding" do
    get project_funding_url(@funding.project, @funding)
    assert_response :success
  end

  test "should get edit" do
    get edit_project_funding_url(@funding.project, @funding)
    assert_response :success
  end

  test "should update funding" do
    patch project_funding_url(@funding.project, @funding), params: {
      funding: {
        amount: @funding.amount,
        application_submitted_at: @funding.application_submitted_at,
        approved_at: @funding.approved_at,
        coc_sent_at: @funding.coc_sent_at,
        coc_signed_at: @funding.coc_signed_at,
        denied_at: @funding.denied_at,
        invoice_sent_at: @funding.invoice_sent_at,
        loan_docs_signed_at: @funding.loan_docs_signed_at,
        project_id: @funding.project_id,
        finance_partner_id: finance_partners(:one).id
      }
    }
    assert_redirected_to project_funding_url(@funding.project, @funding)
  end

  test "should destroy funding" do
    assert_difference("Funding.count", -1) do
      delete project_funding_url(@funding.project, @funding)
    end

    assert_redirected_to fundings_url
  end
end
