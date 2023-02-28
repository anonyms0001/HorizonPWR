class CreateUplineRelations < ActiveRecord::Migration[6.1]
  def change
    create_table :upline_relations do |t|
      t.references :upline, null: false, foreign_key: {to_table: :users}
      t.references :downline, null: false, foreign_key: {to_table: :users}
      t.references :created_by, null: false, foreign_key: {to_table: :users}

      t.boolean :active, default: true

      t.timestamps
    end
  end
end
