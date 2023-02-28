class CreateVotes < ActiveRecord::Migration[6.1]
  def change
    create_table :votes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :feedback, null: false, foreign_key: true

      t.timestamps
    end

    add_column :feedbacks, :votes_count, :integer, default: 0, null: false
  end
end
