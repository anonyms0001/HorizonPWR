class AddInstallTypesToProject < ActiveRecord::Migration[6.1]
  def change
    add_column :projects, :install_types, :jsonb, null: false, default: {}
  end
end
