require "test_helper"

class EarningsControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionEarningsControllerTest < EarningsControllerTest
    setup do
      @earning = earnings(:one)
      @user = users(:one)
      login_as @user
    end

    test "should get index" do
      get earnings_url
      assert_response :success
    end

    test "should get new" do
      get "/earnings/new"
      assert_response 404
    end

    test "should not create earning" do
      assert_raises ActionController::RoutingError do
        post earnings_url, params: {
          earning: {
            amount: @earning.amount,
            downline_earning_id: @earning.downline_earning_id,
            payout_rate_variant_id: @earning.payout_rate_variant_id,
            unit: @earning.unit,
            address_id: @earning.address_id
          }
        }
      end
    end

    test "should show earning" do
      get earning_url(@earning)
      assert_response :success
    end

    test "should get edit" do
      get edit_earning_url(@earning)
      assert_response :success
    end

    test "should update earning" do
      sign_out @user
      @user = users(:ec)
      login_as @user

      patch earning_url(@earning), params: {
        earning: {
          amount: @earning.amount,
          downline_earning_id: @earning.downline_earning_id,
          payout_rate_variant_id: @earning.payout_rate_variant_id,
          unit: @earning.unit,
          address_id: @earning.address_id
        }
      }
      assert_redirected_to earning_url(@earning)
    end

    test "should not destroy earning" do
      assert_raises ActionController::RoutingError do
        delete earning_url(@earning)
      end
    end
  end

  class WithoutPermissionEarningsControllerTest < EarningsControllerTest
    setup do
      @earning = earnings(:one)
      @user = users(:nobody)
      login_as @user
    end

    test "should get index" do
      get earnings_url
      assert_response :success
    end

    test "should not get new" do
      get "/earnings/new"
      assert_response 404
    end

    test "should not create earning" do
      assert_raises ActionController::RoutingError do
        post earnings_url, params: {
          earning: {
            amount: @earning.amount,
            downline_earning_id: @earning.downline_earning_id,
            payout_rate_variant_id: @earning.payout_rate_variant_id,
            unit: @earning.unit,
            address_id: @earning.address_id
          }
        }
      end
    end

    test "should show earning" do
      get earning_url(@earning)
      assert_response :success
    end

    test "should get edit" do
      get edit_earning_url(@earning)
      assert_response :success
    end

    test "should update earning" do
      patch earning_url(@earning), params: {
        earning: {
          amount: @earning.amount,
          downline_earning_id: @earning.downline_earning_id,
          payout_rate_variant_id: @earning.payout_rate_variant_id,
          unit: @earning.unit,
          address_id: @earning.address_id
        }
      }

      assert_redirected_to @earning
    end

    test "should not destroy earning" do
      assert_raises ActionController::RoutingError do
        delete earning_url(@earning)
      end
    end
  end
end
