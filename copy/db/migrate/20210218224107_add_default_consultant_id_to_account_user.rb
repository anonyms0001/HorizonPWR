class AddDefaultConsultantIdToAccountUser < ActiveRecord::Migration[6.1]
  def change
    safety_assured do
      add_reference :account_users, :default_consultant, foreign_key: {to_table: :users}
    end
  end
end
