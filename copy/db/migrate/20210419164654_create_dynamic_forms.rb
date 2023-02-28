class CreateDynamicForms < ActiveRecord::Migration[6.1]
  def change
    create_table :dynamic_forms do |t|
      t.string :model, null: false
      t.string :use_case, null: false

      t.timestamps
    end
  end
end
