# == Schema Information
#
# Table name: feedbacks
#
#  id          :bigint           not null, primary key
#  purpose     :string           not null
#  status      :string           default("new"), not null
#  title       :string           not null
#  votes_count :integer          default(0), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  tracker_id  :string
#  user_id     :bigint           not null
#
# Indexes
#
#  index_feedbacks_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Feedback < ApplicationRecord
  belongs_to :user
  has_one :note, as: :notable, dependent: :destroy
  has_many :votes, dependent: :destroy

  accepts_nested_attributes_for :note

  acts_as_taggable_on :tags

  scope :filtered, -> { where(status: ["new", "planned", "in_progress"]) }

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:title, :status, :purpose],
    associated_against: {
      user: [:first_name, :last_name]
    },
    using: {tsearch: {prefix: true}}

  validates :title, presence: true

  def find_or_build_note
    note || build_note
  end

  def status_color
    case status
    when "new"
      "green"
    when "planned"
      "purple"
    when "in_progress"
      "indigo"
    when "complete"
      "blue"
    when "rejected"
      "red"
    end
  end

  def purpose_color
    case purpose
    when "suggestion"
      "green"
    when "bug"
      "red"
    end
  end

  def self.tag_list
    taggings = ActsAsTaggableOn::Tagging.where(taggable_type: "Feedback")
    ActsAsTaggableOn::Tag.where(id: taggings.map(&:tag_id).uniq)
  end

  def self.purpose_selection
    %w[suggestion bug]
  end

  def self.status_selection
    %w[new planned in_progress complete rejected]
  end
end
