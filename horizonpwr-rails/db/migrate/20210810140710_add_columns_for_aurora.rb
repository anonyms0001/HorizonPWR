class AddColumnsForAurora < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def change
    add_column :users, :aurora_user_id, :text

    add_column :proposals, :aurora_project_id, :text
    add_column :proposals, :aurora_project_source, :text
    add_column :proposals, :aurora_design_id, :text
    add_column :proposals, :aurora_design_completed_at, :datetime
    add_column :proposals, :aurora_design_requested_at, :datetime
    safety_assured do
      add_reference :proposals, :aurora_project_linked_by, foreign_key: {to_table: :users}, index: {algorithm: :concurrently}
    end
  end
end
