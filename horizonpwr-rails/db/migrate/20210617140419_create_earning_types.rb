class CreateEarningTypes < ActiveRecord::Migration[6.1]
  def change
    create_table :earning_types do |t|
      t.string :name, null: false
      t.string :display_name, null: false
      t.boolean :preferred_financial_option, null: false
      t.integer :percent, null: false
      t.references :job_position, null: false, foreign_key: true

      t.timestamps
    end
  end
end
