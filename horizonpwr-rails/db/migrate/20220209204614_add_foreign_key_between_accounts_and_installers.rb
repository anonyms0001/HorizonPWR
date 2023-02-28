class AddForeignKeyBetweenAccountsAndInstallers < ActiveRecord::Migration[6.1]
  def up
    add_foreign_key :accounts, :installers
  end

  def down
    remove_foreign_key :accounts, :installers
  end
end
