# == Schema Information
#
# Table name: job_positions
#
#  id         :bigint           not null, primary key
#  active     :boolean          default(TRUE), not null
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class JobPosition < ApplicationRecord
  has_many :users
  has_many :earning_rates

  include PgSearch::Model
  pg_search_scope :search_by_params, against: [:name, :active], using: {tsearch: {prefix: true}}

  def self.sorted_by_name
    all.order(name: :asc)
  end
end
