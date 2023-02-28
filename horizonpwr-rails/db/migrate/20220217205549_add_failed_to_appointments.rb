class AddFailedToAppointments < ActiveRecord::Migration[6.1]
  def change
    add_column :appointments, :failed, :boolean
  end
end
