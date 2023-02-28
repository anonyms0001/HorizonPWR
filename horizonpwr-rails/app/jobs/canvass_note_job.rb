class CanvassNoteJob < ApplicationJob
  queue_as :default

  def perform(*args)
    Honeybadger.context({args: args})
    # Do something later
    webhook = IncomingWebhook.find(args.first[:IncomingWebhook])
    payload = webhook.payload

    data = payload["canvass"]["data"]
    user = CanvassClient.find_or_link_user(data["employee"])
    address = CanvassClient.find_or_create_address(data["address"])

    note = Note.find_or_initialize_by(canvass_note_id: data["note"]["id"], notable: address, user: user)
    note.body = data["note"]["content"]
    note.save!
  end
end
