class CreateCalendarNotes < ActiveRecord::Migration[6.1]
  def change
    create_table :calendar_notes do |t|
      t.boolean :global
      t.datetime :date
      t.boolean :active, default: true, null: false

      t.timestamps
    end
  end
end
