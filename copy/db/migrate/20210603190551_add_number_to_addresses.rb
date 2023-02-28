class AddNumberToAddresses < ActiveRecord::Migration[6.1]
  def change
    add_column :addresses, :number, :string
  end
end
