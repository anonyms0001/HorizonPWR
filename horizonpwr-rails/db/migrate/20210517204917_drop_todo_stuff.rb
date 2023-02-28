class DropTodoStuff < ActiveRecord::Migration[6.1]
  def up
    drop_table :default_todo_lists, force: :cascade
    drop_table :todo_sections, force: :cascade
    drop_table :todo_lists, force: :cascade
    drop_table :todo_items, force: :cascade
  end

  def down
    fail ActiveRecord::IrreversibleMigration
  end
end
