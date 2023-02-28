module ProjectFeedable
  extend ActiveSupport::Concern

  included do
    has_one :project_feed, as: :project_feedable, touch: true, dependent: :destroy
    accepts_nested_attributes_for :project_feed
  end
end
