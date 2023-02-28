class CreateEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :events do |t|
      t.references :user, foreign_key: true
      t.references :account, foreign_key: true
      t.references :eventable, polymorphic: true, null: false
      t.string :action

      t.timestamps
    end
  end
end
