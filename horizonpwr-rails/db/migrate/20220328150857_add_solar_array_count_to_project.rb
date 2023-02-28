class AddSolarArrayCountToProject < ActiveRecord::Migration[6.1]
  def up
    add_column :projects, :solar_array_count, :integer
  end

  def down
    remove_column :projects, :solar_array_count
  end
end
