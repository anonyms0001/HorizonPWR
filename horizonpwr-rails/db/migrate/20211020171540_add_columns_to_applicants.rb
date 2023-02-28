class AddColumnsToApplicants < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def change
    add_column :applicants, :start_date, :datetime
    safety_assured do
      add_reference :applicants, :created_by, foreign_key: {to_table: :users}, index: {algorithm: :concurrently}
      add_reference :applicants, :account, foreign_key: {to_table: :accounts}, index: {algorithm: :concurrently}
    end
  end
end
