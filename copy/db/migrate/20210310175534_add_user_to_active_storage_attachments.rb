class AddUserToActiveStorageAttachments < ActiveRecord::Migration[6.1]
  def change
    safety_assured do
      add_reference :active_storage_attachments, :user
    end
  end
end
