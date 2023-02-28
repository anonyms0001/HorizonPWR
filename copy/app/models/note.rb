# == Schema Information
#
# Table name: notes
#
#  id                :bigint           not null, primary key
#  installer_invited :boolean          default(FALSE)
#  notable_type      :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  account_id        :bigint
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

  belongs_to :user
  belongs_to :account, optional: true
  belongs_to :installer, optional: true
  belongs_to :notable, polymorphic: true
  has_many :notes, as: :notable, dependent: :destroy
  has_many :note_user_permissions, dependent: :destroy

  acts_as_taggable_on :tags

  has_rich_text :body

  def title
    if parent_record.notable_type.constantize.column_names.include? "title"
      parent_record.notable.title
    else
      parent_record.notable_type
    end
  end

  def parent_record
    notable_type == "Note" ? notable : self
  end

  def is_parent_record?
    notable_type != "Note"
  end
end
