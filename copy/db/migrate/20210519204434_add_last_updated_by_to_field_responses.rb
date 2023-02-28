class AddLastUpdatedByToFieldResponses < ActiveRecord::Migration[6.1]
  def change
    safety_assured do
      add_reference :field_responses, :last_updated_by, foreign_key: {to_table: :users}
      remove_column :field_responses, :user_id
    end
  end
end
