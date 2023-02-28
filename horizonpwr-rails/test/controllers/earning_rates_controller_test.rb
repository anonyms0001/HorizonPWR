require "test_helper"

class EarningRatesControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionEarningRatesControllerTest < EarningRatesControllerTest
    setup do
      @earning_rate = earning_rates(:one)
      @user = users(:one)
      login_as @user
    end

    test "should get index" do
      get earning_rates_url
      assert_response :success
    end

    # NOTE: These should only be created from the within JobPosition > EarningType
    test "should get new" do
      skip
      get new_earning_rate_url
      assert_response :success
    end

    test "should create earning_rate" do
      assert_difference("EarningRate.count") do
        post earning_rates_url, params: {
          earning_rate: {
            active: @earning_rate.active,
            amount: @earning_rate.amount,
            earning_type_id: @earning_rate.earning_type_id,
            range_bottom: @earning_rate.range_bottom,
            range_top: @earning_rate.range_top
          }
        }
      end

      assert_redirected_to earning_type_url(EarningType.last)
    end

    test "should show earning_rate" do
      get earning_rate_url(@earning_rate)
      assert_response :success
    end

    test "should get edit" do
      get edit_earning_rate_url(@earning_rate)
      assert_response :success
    end

    test "should update earning_rate" do
      patch earning_rate_url(@earning_rate), params: {
        earning_rate: {
          active: @earning_rate.active,
          amount: @earning_rate.amount,
          earning_type_id: @earning_rate.earning_type_id,
          range_bottom: @earning_rate.range_bottom,
          range_top: @earning_rate.range_top
        }
      }
      assert_redirected_to earning_rate_url(@earning_rate)
    end

    test "should destroy earning_rate" do
      assert_raises ActionController::RoutingError do
        delete earning_rate_url(@earning_rate)
      end
    end
  end

  # NOTE: Uncomment these if the EarningRatesPolicy gets used.
  # class WithoutPermissionEarningRatesControllerTest < EarningRatesControllerTest
  #   setup do
  #     @earning_rate = earning_rates(:one)
  #     @user = users(:nobody)
  #     login_as @user
  #   end
  #
  #   test "should not get index" do
  #     get earning_rates_url
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not get new" do
  #     get new_earning_rate_url
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not create earning_rate" do
  #     assert_difference("EarningRate.count") do
  #       post earning_rates_url, params: {
  #         earning_rate: {
  #           active: @earning_rate.active,
  #           amount: @earning_rate.amount,
  #           earning_type_id: @earning_rate.earning_type_id,
  #           range_bottom: @earning_rate.range_bottom,
  #           range_top: @earning_rate.range_top
  #         }
  #       }
  #     end
  #
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not show earning_rate" do
  #     get earning_rate_url(@earning_rate)
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not get edit" do
  #     get edit_earning_rate_url(@earning_rate)
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not update earning_rate" do
  #     patch earning_rate_url(@earning_rate), params: {
  #       earning_rate: {
  #         active: @earning_rate.active,
  #         amount: @earning_rate.amount,
  #         earning_type_id: @earning_rate.earning_type_id,
  #         range_bottom: @earning_rate.range_bottom,
  #         range_top: @earning_rate.range_top
  #       }
  #     }
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not destroy earning_rate" do
  #     assert_raises ActionController::RoutingError do
  #       delete earning_rate_url(@earning_rate)
  #     end
  #   end
  # end
end
