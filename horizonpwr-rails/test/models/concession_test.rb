# == Schema Information
#
# Table name: concessions
#
#  id         :bigint           not null, primary key
#  amount     :decimal(, )
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  project_id :bigint           not null
#
# Indexes
#
#  index_concessions_on_project_id  (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#
require "test_helper"

class ConcessionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
