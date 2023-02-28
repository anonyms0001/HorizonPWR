class AddCanvassIdToApplicants < ActiveRecord::Migration[6.1]
  def change
    add_column :applicants, :canvass_user_id, :bigint
  end
end
