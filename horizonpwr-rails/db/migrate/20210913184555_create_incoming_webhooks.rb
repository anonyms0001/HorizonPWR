class CreateIncomingWebhooks < ActiveRecord::Migration[6.1]
  def change
    create_table :incoming_webhooks do |t|
      t.boolean :has_been_run, default: false, null: false
      t.jsonb :payload, null: false
      t.string :event_type

      t.timestamps
    end
  end
end
