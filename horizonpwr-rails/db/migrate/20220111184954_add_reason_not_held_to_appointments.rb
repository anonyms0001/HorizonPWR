class AddReasonNotHeldToAppointments < ActiveRecord::Migration[6.1]
  def change
    add_column :appointments, :reason_not_held, :string
  end
end
