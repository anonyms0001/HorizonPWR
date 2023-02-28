class CreateUserFilters < ActiveRecord::Migration[6.1]
  def change
    create_table :user_filters do |t|
      t.text :name, null: false
      t.text :filter, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
