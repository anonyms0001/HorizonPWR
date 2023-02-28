class CreateDepartments < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def change
    create_table :departments do |t|
      t.string :name
      t.boolean :active, default: true

      t.timestamps
    end

    add_column :job_positions, :department_id, :bigint
    add_index :job_positions, :department_id, algorithm: :concurrently
  end
end
