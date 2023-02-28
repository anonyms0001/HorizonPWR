class CreatePerformanceStats < ActiveRecord::Migration[6.1]
  def up
    create_table :performance_stats do |t|
      t.datetime :start_at, null: false
      t.datetime :end_at, null: false
      t.integer :position
      t.jsonb :kpi, null: false, default: {}
      t.references :accountable, polymorphic: true, null: false

      t.timestamps
    end

    Rake::Task["performance_stats:create"]
  end

  def down
    drop_table :performance_stats
  end
end
