module PerformanceStatsHelper
  def float_to_percent(float)
    "#{(float * 100).to_i}%"
  end
end