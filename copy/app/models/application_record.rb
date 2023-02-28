class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.sort_by_params(column, direction)
    sortable_column = sortable_columns.include?(column) ? column : "created_at"
    order(sortable_column => direction)
  end

  # Override this method to add/remove sortable columns
  def self.sortable_columns
    @@sortable_columns ||= columns.map(&:name)
  end

  def current_user
    Current.user
  end

  def active_status_color
    active ? "green" : "red"
  end

  def halt(tag: :abort, attr: :base, msg: nil)
    errors.add(attr, msg) if msg
    throw(tag)
  end

  def self.statuses
    []
  end
end
