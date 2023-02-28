class CreateFieldResponses < ActiveRecord::Migration[6.1]
  def change
    create_table :field_responses do |t|
      t.references :form_response, null: false, foreign_key: true
      t.references :field_config, null: false, foreign_key: true
      t.references :user, foreign_key: true
      t.text :response

      t.timestamps
    end
  end
end
