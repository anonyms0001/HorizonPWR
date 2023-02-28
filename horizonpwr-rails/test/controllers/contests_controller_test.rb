require "test_helper"

class ContestsControllerTest < ActionDispatch::IntegrationTest
  # NOTE: The contests routes are commented out currently.
  # class WithPermissionsContestsControllerTest < ContestsControllerTest
  #   setup do
  #     @contest = contests(:one)
  #     @user = users(:one)
  #     @user.permissions["can_manage_contests"] = true
  #     @user.save
  #     login_as @user
  #   end
  #
  #   test "should get index" do
  #     get contests_url
  #     assert_response :success
  #   end
  #
  #   test "should get new" do
  #     get new_contest_url
  #     assert_response :success
  #   end
  #
  #   test "should create contest" do
  #     assert_difference("Contest.count") do
  #       post contests_url, params: { contest: {
  #         end_at: @contest.end_at,
  #         name: @contest.name,
  #         start_at: @contest.start_at
  #       } }
  #     end
  #
  #     assert_redirected_to contest_url(Contest.last)
  #   end
  #
  #   # TODO: Fix this before we need to use contests again.
  #   test "should show contest" do
  #     skip
  #     get contest_url(@contest)
  #     assert_response :success
  #   end
  #
  #   test "should get edit" do
  #     get edit_contest_url(@contest)
  #     assert_response :success
  #   end
  #
  #   # TODO: Fix this before we need to use contests again.
  #   test "should update contest" do
  #     skip
  #     patch contest_url(@contest), params: {contest: {end_at: @contest.end_at, name: @contest.name, start_at: @contest.start_at}}
  #     assert_redirected_to contest_url(@contest)
  #   end
  #
  #   # TODO: Fix this when we have the relationship between Contests and Referrals figured out.
  #   # Error:
  #   # ContestsControllerTest::WithPermissionsContestsControllerTest#test_should_destroy_contest:
  #   # ActiveRecord::InvalidForeignKey: PG::ForeignKeyViolation: ERROR:  update or delete on table "contests" violates foreign key constraint "fk_rails_7748af3a32" on table "referrals"
  #   # DETAIL:  Key (id)=(980190962) is still referenced from table "referrals".
  #   #
  #   #     app/controllers/contests_controller.rb:61:in `destroy'
  #   test "should destroy contest" do
  #     skip
  #     assert_difference("Contest.count", -1) do
  #       delete contest_url(@contest)
  #     end
  #
  #     assert_redirected_to contests_url
  #   end
  # end
  #
  # class WithoutPermissionsContestsControllerTest < ContestsControllerTest
  #   setup do
  #     @contest = contests(:one)
  #     @user = users(:one)
  #     login_as @user
  #   end
  #
  #   test "should not get index" do
  #     get contests_url
  #
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not get new" do
  #     get new_contest_url
  #
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should create contest" do
  #     assert_no_difference("Contest.count") do
  #       post contests_url, params: { contest: { end_at: @contest.end_at, name: @contest.name, start_at: @contest.start_at } }
  #     end
  #
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   # TODO: Figure out why there is no error msg.
  #   test "should not show contest" do
  #     get contest_url(@contest)
  #
  #     # No error msg is displayed for some reason.
  #     assert_redirected_to root_url
  #     # follow_redirect!
  #     # assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   test "should not get edit" do
  #     get edit_contest_url(@contest)
  #
  #     assert_redirected_to root_url
  #     follow_redirect!
  #     assert_select "body", /You do not have enough permissions to access that. Please, ask your manager to update your permissions./
  #   end
  #
  #   # TODO: Figure out why there is no error msg.
  #   test "should not update contest" do
  #     patch contest_url(@contest), params: { contest: {
  #       end_at: @contest.end_at,
  #       name: @contest.name,
  #       start_at: @contest.start_at
  #     } }
  #
  #     # No error msg is displayed for some reason.
  #     assert_redirected_to root_url
  #     # follow_redirect!
  #     # assert_select "body", /You do not have permissions./
  #   end
  #
  #   # TODO: Figure out why there is no error msg.
  #   test "should not destroy contest" do
  #     assert_no_difference("Contest.count") do
  #       delete contest_url(@contest)
  #     end
  #
  #     # No error msg is displayed for some reason.
  #     assert_redirected_to root_url
  #     # follow_redirect!
  #     # assert_select "body", /You do not have permissions./
  #   end
  # end
end
