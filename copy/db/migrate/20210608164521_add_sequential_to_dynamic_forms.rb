class AddSequentialToDynamicForms < ActiveRecord::Migration[6.1]
  def change
    add_column :dynamic_forms, :sequential, :boolean, default: false
  end
end
