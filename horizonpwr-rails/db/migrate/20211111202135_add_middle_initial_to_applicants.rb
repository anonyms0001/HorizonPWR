class AddMiddleInitialToApplicants < ActiveRecord::Migration[6.1]
  def change
    add_column :applicants, :middle_initial, :string
  end
end
