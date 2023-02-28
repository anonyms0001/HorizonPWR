class CreatePendingJobPositions < ActiveRecord::Migration[6.1]
  def change
    create_table :pending_job_positions do |t|
      t.string :status, null: false
      t.references :job_position, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.date :effective_at, null: false
      t.references :created_by, null: false, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
