class CreateFormConfigs < ActiveRecord::Migration[6.1]
  def change
    create_table :form_configs do |t|
      t.string :title
      t.boolean :active
      t.integer :position
      t.string :model
      t.string :use_case

      t.timestamps
    end
  end
end
