# == Schema Information
#
# Table name: project_feeds
#
#  id                    :bigint           not null, primary key
#  project_feedable_type :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  project_feedable_id   :bigint           not null
#  project_id            :bigint           not null
#
# Indexes
#
#  index_project_feeds_on_project_feedable  (project_feedable_type,project_feedable_id)
#  index_project_feeds_on_project_id        (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#
class ProjectFeed < ApplicationRecord
  belongs_to :project
  belongs_to :project_feedable, polymorphic: true

  delegated_type :project_feedable, types: %w[Note Event]
end
