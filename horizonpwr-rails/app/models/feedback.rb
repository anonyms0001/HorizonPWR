# == Schema Information
#
# Table name: feedbacks
#
#  id          :bigint           not null, primary key
#  purpose     :string           not null
#  status      :string           default("new"), not null
#  title       :string           not null
#  votes_count :integer          default(0), not null
#  weight      :integer
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
  before_save :set_weight
  after_touch :update_weight
  after_touch :sync_tracker

  accepts_nested_attributes_for :note

  acts_as_taggable_on :tags

  scope :filtered, -> { where(status: ["new", "not_scheduled"]) }
  scope :by_weight, -> { order(weight: :desc, updated_at: :asc) }

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:title, :status, :purpose, :tracker_id, :created_at],
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
    when "not_scheduled"
      "purple"
    when "planned"
      "purple"
    when "in_progress"
      "indigo"
    when "complete"
      "blue"
    when "declined"
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

  def self.statuses
    status_selection
  end

  def self.status_selection
    %w[new not_scheduled planned in_progress complete declined]
  end

  private

  def set_weight
    self.weight = calculate_weight
  end

  def update_weight
    set_weight
    save
  end

  def calculate_weight
    feature_points = purpose == "suggestion" ? 2 : 0
    tracker_points = tracker_id.present? ? 10 : 0

    tag_points = 0
    tag_points += 20 if tag_list.include?("priority")
    tag_points -= 20 if tag_list.include?("not priority")
    tag_points += 5 if tag_list.include?("project managers")
    tag_points += 2 if tag_list.include?("sales support")
    tag_points += 1 if tag_list.include?("EC")
    tag_points += 1 if tag_list.include?("FM")

    # NOTE: This is necessary for Feedbacks that don't have any notes yet.
    note_weight = note.present? ? note.notes&.size : 0

    tracker_points +
      votes_count +
      note_weight +
      feature_points +
      tag_points
  end

  def sync_tracker
    TrackerSyncJob.perform_later(id)
  end
end
