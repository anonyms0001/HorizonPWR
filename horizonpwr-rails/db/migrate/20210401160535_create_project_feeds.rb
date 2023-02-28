class CreateProjectFeeds < ActiveRecord::Migration[6.1]
  def change
    create_table :project_feeds do |t|
      t.references :project, null: false, foreign_key: true
      t.references :project_feedable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
