class AddBlockedByToProposals < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def change
    safety_assured do
      add_reference :proposals, :blocked_by, foreign_key: {to_table: :users}
      add_column :proposals, :blocked_at, :datetime
    end
  end
end
