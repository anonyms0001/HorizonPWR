class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.references :installer, foreign_key: true

      t.timestamps
    end
  end
end
