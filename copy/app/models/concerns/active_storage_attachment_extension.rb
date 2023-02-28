# frozen_string_literal: true

module ActiveStorageAttachmentExtension
  extend ActiveSupport::Concern

  included do
    belongs_to :user, class_name: "User", foreign_key: "user_id", optional: true # ???
    acts_as_taggable_on :tags
  end
end
