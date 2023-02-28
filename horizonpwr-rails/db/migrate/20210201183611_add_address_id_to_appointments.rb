class AddAddressIdToAppointments < ActiveRecord::Migration[6.1]
  def change
    safety_assured do
      add_reference :appointments, :address, foreign_key: {to_table: :addresses}
    end
  end
end
