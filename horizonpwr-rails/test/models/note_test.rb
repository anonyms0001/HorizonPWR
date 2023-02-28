# == Schema Information
#
# Table name: notes
#
#  id                :bigint           not null, primary key
#  installer_invited :boolean          default(FALSE)
#  notable_type      :string           not null
#  users_to_notify   :text             default([])
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  account_id        :bigint
#  canvass_note_id   :bigint
#  installer_id      :bigint
#  notable_id        :bigint           not null
#  user_id           :bigint
#
# Indexes
#
#  index_notes_on_account_id    (account_id)
#  index_notes_on_installer_id  (installer_id)
#  index_notes_on_notable       (notable_type,notable_id)
#  index_notes_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (installer_id => installers.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class NoteTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
