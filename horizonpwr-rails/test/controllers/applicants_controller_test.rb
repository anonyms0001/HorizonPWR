require "test_helper"

class ApplicantsControllerTest < ActionDispatch::IntegrationTest
  class WithoutPermissionApplicantsControllerTest < ApplicantsControllerTest
    setup do
      @applicant = applicants(:one)
    end

    test "should not get index" do
      get applicants_url
      assert_response 302
      follow_redirect!
      assert_select "body", /You need to sign in or sign up before continuing./
    end

    test "should get new" do
      get new_applicant_url
      assert_response :success
    end

    test "should create applicant" do
      assert_difference("Applicant.count") do
        post applicants_url, params: {
          applicant: {
            email: @applicant.email,
            first_name: @applicant.first_name,
            last_name: @applicant.last_name,
            phone: @applicant.phone,
            previously_employed_here: "",
            user_id: "",
            job_position_id: ""
          }
        }
      end

      assert_redirected_to careers_url
    end

    test "should not show applicant" do
      get applicant_url(@applicant)
      assert_response 302
      follow_redirect!
      assert_select "body", /You need to sign in or sign up before continuing./
    end
  end

  class WithPermissionApplicantsControllerTest < ApplicantsControllerTest
    setup do
      @applicant = applicants(:one)
      @user = users(:one)
      login_as @user
    end

    test "should show applicant" do
      get applicant_url(@applicant)
      assert_response :success
    end

    test "should get index" do
      get applicants_url
      assert_response :success
    end

    test "should create applicant" do
      assert_difference("Applicant.count") do
        post applicants_url, params: {
          applicant: {
            email: @applicant.email,
            first_name: @applicant.first_name,
            last_name: @applicant.last_name,
            phone: @applicant.phone,
            previously_employed_here: "",
            user_id: "",
            job_position_id: ""
          }
        }
      end

      assert_redirected_to Applicant.last
    end

    test "should update applicant" do
      patch applicant_url(@applicant), params: {
        applicant: {
          email: @applicant.email,
          first_name: @applicant.first_name,
          last_name: @applicant.last_name,
          phone: @applicant.phone,
          previously_employed_here: "",
          user_id: "",
          job_position_id: ""
        }
      }

      assert_redirected_to applicant_url(@applicant)
    end

    test "should get edit" do
      get edit_applicant_url(@applicant)
      assert_response :success
    end

    # NOTE: We do not currently allow Applicants to be deleted.
    # test "should not destroy applicant" do
    #   assert_no_difference("Applicant.count") do
    #     delete applicant_url(@applicant)
    #   end
    #
    #   assert_redirected_to applicants_url
    #   follow_redirect!
    #   assert_select "body", /You can not delete Applicants/
    # end
  end
end
