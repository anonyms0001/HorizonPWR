class Calendar < ApplicationRecord
  include PgSearch::Model
  # pg_search_scope :search_by_params, against: [:name, :active], using: {tsearch: {prefix: true}}
end
