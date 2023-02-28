class CreateContests < ActiveRecord::Migration[6.1]
  def change
    create_table :contests do |t|
      t.string :name
      t.datetime :start_at
      t.datetime :end_at

      t.timestamps
    end
  end
end
