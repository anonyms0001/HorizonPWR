class CreateAddresses < ActiveRecord::Migration[6.0]
  def change
    create_table :addresses do |t|
      t.string :address
      t.decimal :latitude
      t.decimal :longitude
      t.string :address_type

      t.timestamps
    end
  end
end
