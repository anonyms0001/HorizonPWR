require "test_helper"

class EarningTypesControllerTest < ActionDispatch::IntegrationTest
  class WithPermissionEarningTypesControllerTest < EarningTypesControllerTest
    setup do
      @earning_type = earning_types(:one)
      @user = users(:one)
      login_as @user
    end

    test "should get index" do
      get earning_types_url
      assert_response :success
    end

    test "should get new" do
      get new_earning_type_url
      assert_response :success
    end

    test "should create earning_type" do
      assert_difference("EarningType.count") do
        post earning_types_url, params: {
          earning_type: {
            name: @earning_type.name,
            display_name: @earning_type.display_name,
            percent: @earning_type.percent,
            preferred_financial_option: @earning_type.preferred_financial_option,
            job_position_id: @earning_type.job_position_id
          }
        }
      end

      assert_redirected_to earning_type_url(EarningType.last)
    end

    test "should show earning_type" do
      get earning_type_url(@earning_type)
      assert_response :success
    end

    test "should get edit" do
      get edit_earning_type_url(@earning_type)
      assert_response :success
    end

    test "should update earning_type" do
      patch earning_type_url(@earning_type), params: {
        earning_type: {
          name: @earning_type.name,
          display_name: @earning_type.display_name,
          percent: @earning_type.percent,
          preferred_financial_option: @earning_type.preferred_financial_option,
          job_position_id: @earning_type.job_position_id
        }
      }
      assert_redirected_to earning_type_url(@earning_type)
    end

    test "should destroy earning_type" do
      assert_raises ActionController::RoutingError do
        delete earning_type_url(@earning_type)
      end
    end
  end

  # NOTE: Uncomment these when the EarningTypesPolicy gets used.
  # class WithoutPermissionEarningTypesControllerTest < EarningTypesControllerTest
  #   setup do
  #     @earning_type = earning_types(:one)
  #     @user = users(:nobody)
  #     login_as @user
  #   end
  #
  #   test "should not get index" do
  #     get earning_types_url
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not get new" do
  #     get new_earning_type_url
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not create earning_type" do
  #     assert_difference("EarningType.count") do
  #       post earning_types_url, params: {
  #         earning_type: {
  #           name: @earning_type.name,
  #           display_name: @earning_type.display_name,
  #           percent: @earning_type.percent,
  #           preferred_financial_option: @earning_type.preferred_financial_option,
  #           job_position_id: @earning_type.job_position_id
  #         }
  #       }
  #     end
  #
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not show earning_type" do
  #     get earning_type_url(@earning_type)
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not get edit" do
  #     get edit_earning_type_url(@earning_type)
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not update earning_type" do
  #     patch earning_type_url(@earning_type), params: {
  #       earning_type: {
  #         name: @earning_type.name,
  #         display_name: @earning_type.display_name,
  #         percent: @earning_type.percent,
  #         preferred_financial_option: @earning_type.preferred_financial_option,
  #         job_position_id: @earning_type.job_position_id
  #       }
  #     }
  #
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not destroy earning_type" do
  #     assert_raises ActionController::RoutingError do
  #       delete earning_type_url(@earning_type)
  #     end
  #   end
  # end
end
