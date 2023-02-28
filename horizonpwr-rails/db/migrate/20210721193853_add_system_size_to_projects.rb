class AddSystemSizeToProjects < ActiveRecord::Migration[6.1]
  def change
    add_column :projects, :system_size, :decimal
  end
end
