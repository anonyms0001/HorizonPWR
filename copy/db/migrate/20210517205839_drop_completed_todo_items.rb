class DropCompletedTodoItems < ActiveRecord::Migration[6.1]
  def up
    drop_table :completed_todo_items, force: :cascade
  end

  def down
    fail ActiveRecord::IrreversibleMigration
  end
end
