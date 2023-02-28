require "test_helper"

class UplineRelationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @upline_relation = upline_relations(:one)
    @user = users(:one)
    login_as @user
  end

  test "should get index" do
    get upline_relations_url
    assert_response :success
  end

  test "should get new" do
    get new_upline_relation_url
    assert_response :success
  end

  test "should create upline_relation" do
    assert_difference("UplineRelation.count") do
      post upline_relations_url, params: {
        upline_relation: {
          active: @upline_relation.active,
          created_by_id: @upline_relation.created_by_id,
          downline_id: @upline_relation.upline_id,
          upline_id: @upline_relation.downline_id
        }
      }
    end

    assert_redirected_to upline_relation_url(UplineRelation.last)
  end

  test "should show upline_relation" do
    get upline_relation_url(@upline_relation)
    assert_response :success
  end

  test "should get edit" do
    get edit_upline_relation_url(@upline_relation)
    assert_response :success
  end

  test "should update upline_relation" do
    patch upline_relation_url(@upline_relation), params: {upline_relation: {active: @upline_relation.active, created_by_id: @upline_relation.created_by_id, downline_id: @upline_relation.downline_id, upline_id: @upline_relation.upline_id}}
    assert_redirected_to upline_relation_url(@upline_relation)
  end

  test "should destroy upline_relation" do
    delete upline_relation_url(@upline_relation)

    assert_redirected_to upline_relations_url
    follow_redirect!
    assert_select "body", /We don't delete Upline relations/
  end
end
