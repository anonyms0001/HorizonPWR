class AddHeldByToAppointments < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def change
    safety_assured do
      add_reference :appointments, :held_by, foreign_key: {to_table: :users}, index: {algorithm: :concurrently}
      add_column :appointments, :held_at, :datetime
      add_column :appointments, :held, :boolean
    end
  end
end
