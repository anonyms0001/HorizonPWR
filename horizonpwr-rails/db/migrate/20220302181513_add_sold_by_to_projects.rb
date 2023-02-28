class AddSoldByToProjects < ActiveRecord::Migration[6.1]
  def up
    safety_assured do
      add_reference :projects, :account, foreign_key: {to_table: :accounts}
      add_reference :projects, :sold_by, foreign_key: {to_table: :users}

      Project.find_each do |project|
        project.update_sold_by
      end
    end
  end

  # Trying to resolve accuracy issues with SI on leaderboard
  #
  # We are off by 3 total SI between SF and pwrprod, which 3
  # Some teams have the wrong number of projects, we don't know why
  # If each team could see all of the projects associated with their team, they could tell us which ones are missing.
  # So if the project index and project show pages also showed the name of the teams that they belong to, then we could identify issues easier
  # If an EC could see all of their projects in the projects index page, they could tell us which ones are missing more easily.
  #
  # after_save on appointment when updating consult, if scheduled_with changes, also change project_scheduled_with
  # after_project_create set account and sold_by
  # check after deploy to see if project.account_id or sold_by id is null

  # ISSUE: SF SI to PWR projects counts
  #

  def down
    remove_reference :projects, :account
    remove_reference :projects, :sold_by
  end
end
