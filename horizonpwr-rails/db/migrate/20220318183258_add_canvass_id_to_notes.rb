class AddCanvassIdToNotes < ActiveRecord::Migration[6.1]
  def up
    add_column :notes, :canvass_note_id, :bigint
    IncomingWebhook.where(event_type: "Canvass-Note").find_each do |hook|
      CanvassNoteJob.perform_later(hook.hook_args)
    end
  end

  def down
    remove_column :notes, :canvass_note_id
  end
end
