class AddHeldReasonToAppointments < ActiveRecord::Migration[6.1]
  def up
    add_column :appointments, :held_reason, :string
    safety_assured { remove_column :appointments, :reason_not_held, :string }
  end

  def down
    remove_column :appointments, :held_reason, :string
    add_column :appointments, :reason_not_held, :string
  end
end
