class AddHistoricCanvassIdsToAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :historic_canvass_team_ids, :text, array: true, default: []
    Account.where.not(canvass_team_id: nil).each { |a| a.update_attribute(:historic_canvass_team_ids, a.historic_canvass_team_ids.push(a.canvass_team_id)) }
  end
end
