require "test_helper"

class AttachmentTagsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @attachment_tag = attachment_tags(:one)
  end

  # test "should get index" do
  #   get attachment_tags_url
  #   assert_response :success
  # end
  #
  # test "should get new" do
  #   get new_attachment_tag_url
  #   assert_response :success
  # end
  #
  # test "should create attachment_tag" do
  #   assert_difference('AttachmentTag.count') do
  #     post attachment_tags_url, params: { attachment_tag: { edit: @attachment_tag.edit, index: @attachment_tag.index, new: @attachment_tag.new, show: @attachment_tag.show } }
  #   end
  #
  #   assert_redirected_to attachment_tag_url(AttachmentTag.last)
  # end
  #
  # test "should show attachment_tag" do
  #   get attachment_tag_url(@attachment_tag)
  #   assert_response :success
  # end
  #
  # test "should get edit" do
  #   get edit_attachment_tag_url(@attachment_tag)
  #   assert_response :success
  # end
  #
  # test "should update attachment_tag" do
  #   patch attachment_tag_url(@attachment_tag), params: { attachment_tag: { edit: @attachment_tag.edit, index: @attachment_tag.index, new: @attachment_tag.new, show: @attachment_tag.show } }
  #   assert_redirected_to attachment_tag_url(@attachment_tag)
  # end
  #
  # test "should destroy attachment_tag" do
  #   assert_difference('AttachmentTag.count', -1) do
  #     delete attachment_tag_url(@attachment_tag)
  #   end
  #
  #   assert_redirected_to attachment_tags_url
  # end
end
