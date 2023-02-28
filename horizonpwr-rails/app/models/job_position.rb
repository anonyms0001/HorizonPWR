# == Schema Information
#
# Table name: job_positions
#
#  id            :bigint           not null, primary key
#  active        :boolean          default(TRUE), not null
#  hiring        :boolean          default(FALSE)
#  hiring_public :boolean          default(FALSE)
#  leadership    :boolean          default(FALSE)
#  name          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  department_id :bigint
#
# Indexes
#
#  index_job_positions_on_department_id  (department_id)
#
class JobPosition < ApplicationRecord
  belongs_to :department
  has_many :users
  has_many :earning_types

  include PgSearch::Model
  pg_search_scope :search_by_params, against: [:name, :active], using: {tsearch: {prefix: true}}
  scope :active, -> { where(active: true) }
  scope :currently_hiring, -> { where(active: true, hiring: true, hiring_public: true) }

  has_rich_text :description

  def self.name_like(name)
    JobPosition.where("name like ?", "%#{name}%")
  end

  def self.sorted_by_name
    all.order(name: :asc)
  end

  def active?
    active
  end

  def self.setter_positions_select
    self.name_like("Marketer")
  end

  def self.closer_positions_select
    sales_dept = Department.find_by(name: "Sales")
    sales_dept.job_positions.where(leadership: true).or(sales_dept.job_positions.where(name: "Energy Consultant"))
  end
end
