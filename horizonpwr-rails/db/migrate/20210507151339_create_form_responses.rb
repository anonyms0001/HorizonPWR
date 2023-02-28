class CreateFormResponses < ActiveRecord::Migration[6.1]
  def change
    create_table :form_responses do |t|
      t.references :respondable, polymorphic: true, null: false
      t.references :dynamic_form, null: false, foreign_key: true

      t.timestamps
    end
  end
end
