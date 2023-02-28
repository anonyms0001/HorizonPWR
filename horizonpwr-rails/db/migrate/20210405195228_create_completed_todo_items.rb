class CreateCompletedTodoItems < ActiveRecord::Migration[6.1]
  def change
    create_table :completed_todo_items do |t|
      t.references :todo_item, null: false, foreign_key: true
      t.references :completed_by, null: false, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
