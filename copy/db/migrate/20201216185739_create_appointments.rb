class CreateAppointments < ActiveRecord::Migration[6.0]
  def change
    create_table :appointments do |t|
      t.datetime :date
      t.string :appointment_status, null: false, default: "scheduled"
      t.string :appointment_status_reason
      t.string :appointment_type, null: false
      t.string :source, default: "pwrstation"
      t.references :created_by, foreign_key: {to_table: :users}
      t.references :scheduled_with, foreign_key: {to_table: :users}
      t.references :account, foreign_key: true

      t.timestamps
    end
  end
end
