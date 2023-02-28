class AddEventableActionToFieldConfigs < ActiveRecord::Migration[6.1]
  def change
    add_column :field_configs, :eventable_action, :string
  end
end
