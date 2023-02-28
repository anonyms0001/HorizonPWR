require "test_helper"

class NoteMailerTest < ActionMailer::TestCase
  # NOTE: We should not need to test this since we are using Noticed.
  # test "user_mention" do
  #   mail = NoteMailer.user_mention
  #   assert_equal "User mention", mail.subject
  #   assert_equal ["to@example.org"], mail.to
  #   assert_equal ["from@example.com"], mail.from
  #   assert_match "Hi", mail.body.encoded
  # end
end
