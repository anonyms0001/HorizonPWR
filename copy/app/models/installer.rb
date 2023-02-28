# == Schema Information
#
# Table name: installers
#
#  id                      :bigint           not null, primary key
#  active                  :boolean
#  name                    :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  salesforce_installer_id :string
#
class Installer < ApplicationRecord
  has_many :projects, dependent: :nullify

  include PgSearch::Model
  pg_search_scope :search_by_params, against: :name, using: {tsearch: {prefix: true}}
end
