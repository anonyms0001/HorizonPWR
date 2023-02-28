class CreateConcessions < ActiveRecord::Migration[6.1]
  def change
    create_table :concessions do |t|
      t.decimal :amount
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
