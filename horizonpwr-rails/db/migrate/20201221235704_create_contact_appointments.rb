class CreateContactAppointments < ActiveRecord::Migration[6.0]
  def change
    create_table :contact_appointments do |t|
      t.references :appointment, null: false, foreign_key: true
      t.references :contact, null: false, foreign_key: true
      t.references :project, foreign_key: true
      t.references :address, foreign_key: true

      t.timestamps
    end
  end
end
