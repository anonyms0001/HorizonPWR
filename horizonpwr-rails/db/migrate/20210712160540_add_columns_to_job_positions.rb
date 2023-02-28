class AddColumnsToJobPositions < ActiveRecord::Migration[6.1]
  def change
    add_column :job_positions, :hiring, :boolean, default: false
    add_column :job_positions, :hiring_public, :boolean, default: false
    add_column :job_positions, :leadership, :boolean, default: false
  end
end
