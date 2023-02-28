class CreateEarningTypes < ActiveRecord::Migration[6.1]
  def change
    create_table :earning_types do |t|
      t.string :name, null: false
      t.string :display_name, null: false
      t.boolean :preferred_financial_option, null: false
      t.integer :percent, null: false

      t.timestamps
    end
  end
end
