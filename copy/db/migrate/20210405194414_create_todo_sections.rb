class CreateTodoSections < ActiveRecord::Migration[6.1]
  def change
    create_table :todo_sections do |t|
      t.integer :position
      t.string :name
      t.string :slug
      t.boolean :active
      t.references :todo_list, null: false, foreign_key: true

      t.timestamps
    end
  end
end
