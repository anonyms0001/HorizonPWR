# == Schema Information
#
# Table name: upline_relations
#
#  id            :bigint           not null, primary key
#  active        :boolean          default(TRUE)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  created_by_id :bigint           not null
#  downline_id   :bigint           not null
#  upline_id     :bigint           not null
#
# Indexes
#
#  index_upline_relations_on_created_by_id  (created_by_id)
#  index_upline_relations_on_downline_id    (downline_id)
#  index_upline_relations_on_upline_id      (upline_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (downline_id => users.id)
#  fk_rails_...  (upline_id => users.id)
#
require "test_helper"

class UplineRelationTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
