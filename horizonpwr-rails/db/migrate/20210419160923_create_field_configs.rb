class CreateFieldConfigs < ActiveRecord::Migration[6.1]
  def change
    create_table :field_configs do |t|
      t.references :form_config, null: false, foreign_key: true
      t.string :title, null: false
      t.string :label
      t.string :field_type, null: false
      t.text :options, array: true
      t.integer :position
      t.boolean :active, null: false, default: true
      t.boolean :required, null: false
      t.boolean :repeatable, null: false

      t.timestamps
    end
  end
end
