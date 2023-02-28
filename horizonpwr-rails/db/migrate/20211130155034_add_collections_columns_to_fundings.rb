class AddCollectionsColumnsToFundings < ActiveRecord::Migration[6.1]
  def change
    add_column :fundings, :sent_to_collections_at, :datetime
    safety_assured do
      add_reference :fundings, :sent_to_collections_by, foreign_key: {to_table: :users}
    end
  end
end
