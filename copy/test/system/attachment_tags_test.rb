require "application_system_test_case"

class AttachmentTagsTest < ApplicationSystemTestCase
  setup do
    @attachment_tag = attachment_tags(:one)
  end
  # TODO:
  # Don't worry about these tests for now. We will come back to them when we have a more solid understanding of how we are handling tags on attachments.
  #
  # test "visiting the index" do
  #   visit attachment_tags_url
  #   assert_selector "h1", text: "Attachment Tags"
  # end
  #
  # test "creating a Attachment tag" do
  #   visit attachment_tags_url
  #   click_on "New Attachment Tag"
  #
  #   fill_in "Edit", with: @attachment_tag.edit
  #   fill_in "Index", with: @attachment_tag.index
  #   fill_in "New", with: @attachment_tag.new
  #   fill_in "Show", with: @attachment_tag.show
  #   click_on "Create Attachment tag"
  #
  #   assert_text "Attachment tag was successfully created"
  #   assert_selector "h1", text: "Attachment Tags"
  # end
  #
  # test "updating a Attachment tag" do
  #   visit attachment_tag_url(@attachment_tag)
  #   click_on "Edit", match: :first
  #
  #   fill_in "Edit", with: @attachment_tag.edit
  #   fill_in "Index", with: @attachment_tag.index
  #   fill_in "New", with: @attachment_tag.new
  #   fill_in "Show", with: @attachment_tag.show
  #   click_on "Update Attachment tag"
  #
  #   assert_text "Attachment tag was successfully updated"
  #   assert_selector "h1", text: "Attachment Tags"
  # end
  #
  # test "destroying a Attachment tag" do
  #   visit edit_attachment_tag_url(@attachment_tag)
  #   click_on "Delete", match: :first
  #   click_on "Confirm"
  #
  #   assert_text "Attachment tag was successfully destroyed"
  # end
end
