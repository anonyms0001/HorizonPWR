class CreateContactAddresses < ActiveRecord::Migration[6.0]
  def change
    create_table :contact_addresses do |t|
      t.boolean :primary_contact
      t.references :address, null: false, foreign_key: true
      t.references :contact, null: false, foreign_key: true
      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
