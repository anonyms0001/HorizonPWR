Rails.application.config.active_storage.paths[:libreoffice] = "/Applications/LibreOffice.app/Contents/MacOS/Soffice"
Rails.application.config.active_storage.previewers << DocumentPreviewer

Rails.configuration.to_prepare do
  ActiveStorage::Attachment.include ActiveStorageAttachmentExtension
end
