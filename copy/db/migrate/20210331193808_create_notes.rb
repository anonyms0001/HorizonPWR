class CreateNotes < ActiveRecord::Migration[6.1]
  def change
    create_table :notes do |t|
      t.references :user, foreign_key: true
      t.references :account, foreign_key: true
      t.references :installer, foreign_key: true
      t.references :notable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
