class CreateFeedbacks < ActiveRecord::Migration[6.1]
  def change
    create_table :feedbacks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :status, null: false, default: "new"
      t.string :title, null: false
      t.string :tracker_id
      t.string :purpose, null: false

      t.timestamps
    end
  end
end
