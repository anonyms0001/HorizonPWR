module NotesHelper
  def note_tag_block(note, tag)
    if note.tag_list.include?(tag)
      button_to tag, delete_tag_path(tag: tag, id: note.id), method: :post, class: "inline-flex mb-3 mr-3 rounded-md items-center py-0.5 p-2.5 text-md
                        font-medium bg-green-100 text-green-700 border-green-300 ring-green-500 border border-green-500 cursor-pointer"
    else
      button_to tag, note_tags_path(tag: tag, id: note.id), method: :post, class: "inline-flex mb-3 mr-3 rounded-md items-center py-0.5 p-2.5 text-md
                        font-medium bg-red-100 text-red-700 border-red-300 ring-red-500 border border-red-500 cursor-pointer"
    end
  end
end
