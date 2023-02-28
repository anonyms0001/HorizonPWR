class CreateNoteUserPermissions < ActiveRecord::Migration[6.1]
  def change
    create_table :note_user_permissions do |t|
      t.references :note, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
