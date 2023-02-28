require "test_helper"

class AdjustmentsControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionAdjustmentsControllerTest < AdjustmentsControllerTest
    setup do
      @earning = earnings(*:one)
      @adjustment = adjustments(:one)
      @user = users(:one)
      login_as @user
    end

    test "should get index" do
      get adjustments_url
      assert_response :success
    end

    test "should get new" do
      get earning_adjustments_url(@earning)
      assert_response :success
    end

    test "should create adjustment" do
      assert_difference("Adjustment.count") do
        post earning_adjustments_url(@earning), params: {
          adjustment: {
            amount: @adjustment.amount,
            description: "<div>MyString</div>"
          }
        }
      end

      assert_redirected_to payout_url(@earning.payout_line_item.payout)
    end

    test "should show adjustment" do
      get adjustment_url(@adjustment)
      assert_response :success
    end

    test "should get edit" do
      get edit_earning_adjustment_url(@earning, @adjustment)
      assert_response :success
    end

    test "should update adjustment" do
      patch earning_adjustment_url(@earning, @adjustment), params: {
        adjustment: {
          amount: @adjustment.amount,
          description: "<div>MyString</div>"
        }
      }
      assert_redirected_to adjustment_url(@adjustment)
    end

    test "should destroy adjustment" do
      assert_difference("Adjustment.count", -1) do
        delete adjustment_url(@adjustment)
      end

      assert_redirected_to adjustments_url
    end
  end

  class WithoutPermissionAdjustmentsControllerTest < AdjustmentsControllerTest
    setup do
      @earning = earnings(*:one)
      @adjustment = adjustments(:one)
      @user = users(:nobody)
      login_as @user
    end

    test "should not get index" do
      get adjustments_url
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get new" do
      get earning_adjustments_url(@earning)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not create adjustment" do
      assert_no_difference("Adjustment.count") do
        post earning_adjustments_url(@earning), params: {
          adjustment: {
            amount: @adjustment.amount,
            description: "<div>MyString</div>"
          }
        }
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not show adjustment" do
      get adjustment_url(@adjustment)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not get edit" do
      get edit_earning_adjustment_url(@earning, @adjustment)
      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not update adjustment" do
      patch earning_adjustment_url(@earning, @adjustment), params: {
        adjustment: {
          amount: @adjustment.amount,
          description: "<div>MyString</div>"
        }
      }

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end

    test "should not destroy adjustment" do
      assert_no_difference("Adjustment.count", -1) do
        delete adjustment_url(@adjustment)
      end

      assert_redirected_to root_url
      follow_redirect!
      assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
    end
  end
end
