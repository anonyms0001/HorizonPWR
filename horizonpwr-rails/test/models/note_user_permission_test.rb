# == Schema Information
#
# Table name: note_user_permissions
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  note_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_note_user_permissions_on_note_id  (note_id)
#  index_note_user_permissions_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (note_id => notes.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class NoteUserPermissionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
