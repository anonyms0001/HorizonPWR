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
class Note < ApplicationRecord
  include ProjectFeedable
  before_save :clean_up_users_to_notify, unless: :no_users_to_notify
  before_create :add_installer_tag, if: :is_solar_installer?
  serialize :users_to_notify, Array

  belongs_to :user
  belongs_to :account, optional: true
  belongs_to :applicant, optional: true
  belongs_to :appointment, optional: true
  belongs_to :installer, optional: true
  belongs_to :notable, polymorphic: true, touch: true
  has_many :notes, as: :notable, dependent: :destroy
  has_many :note_user_permissions, dependent: :destroy

  scope :chronologically_ordered, -> { order(created_at: :desc) }

  acts_as_taggable_on :tags

  has_rich_text :body

  def title
    if parent_record.notable_type.constantize.column_names.include? "title"
      parent_record.notable.title
    else
      parent_record.notable_type
    end
  end

  # TODO: Change this method to parent_note for clarity. This is misleading.
  def parent_record
    notable_type == "Note" ? notable : self
  end

  def is_parent_record?
    notable_type != "Note"
  end

  def is_solar_installer?
    notable_type == "Project" && current_user.solar_installer?
  end

  def add_installer_tag
    tag_list.add("Installer")
  end

  def user_mentions
    # TODO: Can this be refactored?
    body.body.attachments.select { |a| a.attachable.instance_of?(User) }.map(&:attachable).uniq
  end

  def user_mention_exists?
    body.body.attachments.any?
  end

  private

  def no_users_to_notify
    users_to_notify.nil?
  end

  def clean_up_users_to_notify
    users_to_notify.uniq!
  end
end
