class CreateTodoItems < ActiveRecord::Migration[6.1]
  def change
    create_table :todo_items do |t|
      t.integer :position, null: false
      t.string :description_slug
      t.boolean :active
      t.references :todo_section, null: false, foreign_key: true

      t.timestamps
    end
  end
end
