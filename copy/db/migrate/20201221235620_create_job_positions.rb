class CreateJobPositions < ActiveRecord::Migration[6.0]
  def change
    create_table :job_positions do |t|
      t.string :name
      t.boolean :active, null: false, default: true

      t.timestamps
    end
  end
end
