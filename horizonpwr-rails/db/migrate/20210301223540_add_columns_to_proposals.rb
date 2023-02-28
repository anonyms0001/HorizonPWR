class AddColumnsToProposals < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def change
    safety_assured do
      add_reference :proposals, :address
      Proposal.reset_column_information
      Proposal.update_all("address_id = appointments.address_id FROM appointments WHERE appointment_id = appointments.id")
    end
  end
end
