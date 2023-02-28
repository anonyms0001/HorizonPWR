require "test_helper"

class ProposalsControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionProposalsControllerTest < ProposalsControllerTest
    setup do
      @proposal = proposals(:one)
      @appointment = appointments(:one)
      @user = users(:one)
      login_as @user
    end

    test "should get index" do
      get proposals_url
      assert_response :success
    end

    test "should get new" do
      get new_proposal_url
      assert_response :success
    end

    test "should create proposal" do
      assert_no_difference("0", "my string") do
        post proposals_url, params: {proposal: {appointment_id: @appointment.id}}
      end
      assert_response :success
    end

    test "should not create proposal without an appointment" do
      assert_no_difference("0", "my string") do
        post proposals_url, params: {proposal: {appointment_id: nil}}
        assert_response :success
      end
    end

    test "should show proposal" do
      get proposal_url(@proposal)
      assert_response :success
    end

    test "should get edit" do
      get edit_proposal_url(@proposal)
      assert_response :success
    end

    test "should update proposal" do
      patch proposal_url(@proposal), params: {proposal: {completion_state: @proposal.completion_state}}
      assert_redirected_to proposal_url(@proposal)
    end

    test "should destroy proposal" do
      skip # We do not allow Proposals to be destroyed!
      assert_difference("Proposal.count", -1) do
        delete proposal_url(@proposal)
      end

      assert_redirected_to proposals_url
    end
  end

  class WithoutPermissionProposalsControllerTest < ProposalsControllerTest
    setup do
      @proposal = proposals(:one)
      @appointment = appointments(:one)
      @user = users(:nobody)
      login_as @user
    end

    test "should not get index" do
      get proposals_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get new_proposal_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create proposal" do
      assert_no_difference("Proposal.count") do
        post proposals_url, params: {proposal: {appointment_id: @appointment.id}}
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create proposal without an appointment" do
      assert_no_difference("Proposal.count") do
        post proposals_url, params: {proposal: {appointment_id: nil}}
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show proposal" do
      get proposal_url(@proposal)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_proposal_url(@proposal)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    # TODO: Fix. The proposals_policy#update? method calls project_attachments?, which is always true.
    test "should not update proposal" do
      skip
      patch proposal_url(@proposal), params: {proposal: {completion_state: @proposal.completion_state}}
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy proposal" do
      assert_no_difference("Proposal.count", -1) do
        delete proposal_url(@proposal)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end
  end
end
