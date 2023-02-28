require "test_helper"

class PayoutsControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionPayoutsControllerTest < PayoutsControllerTest
    setup do
      @payout = payouts(:one)
      @user = users(:one)
      login_as @user
    end

    test "should get index" do
      get payouts_url
      assert_response :success
    end

    test "should get new" do
      get new_payout_url
      assert_response :success
    end

    test "should create payout" do
      assert_difference("Payout.count") do
        post payouts_url, params: {
          payout: {
            approved_by_id: @payout.approved_by_id,
            paid_by_id: @payout.paid_by_id,
            paid_at: @payout.paid_at,
            pay_date: @payout.pay_date,
            pay_total: @payout.pay_total,
            status: @payout.status,
            user_id: @payout.user_id
          }
        }
      end

      assert_redirected_to payout_url(Payout.last)
    end

    test "should show payout" do
      get payout_url(@payout)
      assert_response :success
    end

    test "should get edit" do
      get edit_payout_url(@payout)
      assert_response :success
    end

    test "should update payout" do
      patch payout_url(@payout), params: {
        payout: {
          approved_by_id: @payout.approved_by_id,
          paid_by_id: @payout.paid_by_id,
          paid_at: @payout.paid_at,
          pay_date: @payout.pay_date,
          pay_total: @payout.pay_total,
          status: @payout.status,
          user_id: @payout.user_id
        }
      }
      assert_redirected_to payout_url(@payout)
    end

    test "should destroy payout" do
      assert_raises ActionController::RoutingError do
        delete payout_url(@payout)
      end
    end
  end

  class WithoutPermissionPayoutsControllerTest < PayoutsControllerTest
    setup do
      @payout = payouts(:one)
      @user = users(:nobody)
      login_as @user
    end

    test "should not get index" do
      get payouts_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get new_payout_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create payout" do
      assert_no_difference("Payout.count") do
        post payouts_url, params: {
          payout: {
            approved_by_id: @payout.approved_by_id,
            paid_by_id: @payout.paid_by_id,
            paid_at: @payout.paid_at,
            pay_date: @payout.pay_date,
            pay_total: @payout.pay_total,
            status: @payout.status,
            user_id: @payout.user_id
          }
        }
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show payout" do
      get payout_url(@payout)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_payout_url(@payout)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not update payout" do
      patch payout_url(@payout), params: {
        payout: {
          approved_by_id: @payout.approved_by_id,
          paid_by_id: @payout.paid_by_id,
          paid_at: @payout.paid_at,
          pay_date: @payout.pay_date,
          pay_total: @payout.pay_total,
          status: @payout.status,
          user_id: @payout.user_id
        }
      }

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy payout" do
      assert_raises ActionController::RoutingError do
        delete payout_url(@payout)
      end
    end
  end
end
