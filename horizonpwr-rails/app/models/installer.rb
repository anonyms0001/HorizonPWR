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
# Indexes
#
#  index_installers_on_salesforce_installer_id  (salesforce_installer_id)
#
class Installer < ApplicationRecord
  has_many :accounts, dependent: :nullify
  has_many :projects, dependent: :nullify

  validates :name, presence: true

  after_create :create_installer_account

  include PgSearch::Model
  pg_search_scope :search_by_params, against: :name, using: {tsearch: {prefix: true}}
  scope :sorted, -> { order(active: :desc, name: :desc) }

  def create_installer_account
    accounts.create!(
      name: name,
      owner: User.first,
      active: true
    )
  end
end
