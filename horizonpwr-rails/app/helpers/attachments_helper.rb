module AttachmentsHelper
  def get_preview_image_settings(content_type)
    case content_type
    when "application/pdf"
      ["red", "file-pdf", "far"]
    when "audio/wav", "audio/vnd.wave"
      ["gray", "file-audio", "far"]
    when "application/zip"
      ["gray", "file-archive", "far"]
    when "text/csv"
      ["gray", "file-csv", "fas"]
    when "video/quicktime"
      ["gray", "file-video", "far"]
    when "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ["gray", "file-excel", "far"]
    when "text/xml", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ["gray", "code", "fas"]
    else
      ["gray", "question", "fas"]
    end
  end
end
