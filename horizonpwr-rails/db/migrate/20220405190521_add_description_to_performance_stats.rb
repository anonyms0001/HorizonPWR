class AddDescriptionToPerformanceStats < ActiveRecord::Migration[6.1]
  def up
    add_column :performance_stats, :kpi_type, :string
    PerformanceStat.update_all(kpi_type: 'sales')
    Rake::Task['performance_stats:sync_installer_stats'].invoke
  end

  def down
    PerformanceStat.where(kpi_type: 'installers').delete_all
    remove_column :performance_stats, :kpi_type
  end
end
