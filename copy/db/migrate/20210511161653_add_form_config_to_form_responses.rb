class AddFormConfigToFormResponses < ActiveRecord::Migration[6.1]
  def change
    safety_assured { add_reference :form_responses, :form_config, null: false, foreign_key: true }
  end
end
