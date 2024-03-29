# == Schema Information
#
# Table name: accounts
#
#  id                 :bigint           not null, primary key
#  active             :boolean          default(FALSE)
#  card_exp_month     :string
#  card_exp_year      :string
#  card_last4         :string
#  card_type          :string
#  domain             :string
#  extra_billing_info :text
#  name               :string           not null
#  personal           :boolean          default(FALSE)
#  processor          :string
#  subdomain          :string
#  trial_ends_at      :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  canvass_team_id    :string
#  owner_id           :bigint
#  processor_id       :string
#
# Indexes
#
#  index_accounts_on_owner_id  (owner_id)
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#

class Account < ApplicationRecord
  include Pay::Billable

  RESERVED_DOMAINS = [Jumpstart.config.domain]
  RESERVED_SUBDOMAINS = %w[app help support]

  belongs_to :owner, class_name: "User"

  has_many :account_invitations, dependent: :destroy
  has_many :account_users, dependent: :destroy
  has_many :appointments, through: :users
  has_many :notifications, dependent: :destroy
  has_many :users, through: :account_users

  scope :personal, -> { where(personal: true) }
  scope :impersonal, -> { where(personal: false) }
  scope :sorted, -> { order(personal: :desc, name: :asc) }

  has_noticed_notifications
  has_one_attached :avatar

  validates :name, presence: true
  validates :domain, exclusion: {in: RESERVED_DOMAINS, message: :reserved}
  validates :subdomain, exclusion: {in: RESERVED_SUBDOMAINS, message: :reserved}, format: {with: /\A[a-zA-Z0-9]+[a-zA-Z0-9\-_]*[a-zA-Z0-9]+\Z/, message: :format, allow_blank: true}

  def email
    account_users.includes(:user).order(created_at: :asc).first.user.email
  end

  def personal_account_for?(user)
    personal? && owner_id == user.id
  end

  def field_marketer_select
    user_select("Marketer")
  end

  def energy_consultant_select
    user_select("Energy Consultant")
  end

  def user_select(job_position)
    job_ids = JobPosition.where("name like ? OR name like ?", "%#{job_position}%", "%Manager%").map(&:id)
    users.where(active: true).where(job_position_id: job_ids).order(first_name: :asc)
  end

  def account_default_manager
    AccountUser.default_managers.find_by(account: self)&.user || AccountUser.chief_executive_officer
  end

  # AccountUser.find_by(account: account)
  # AccountUser.default_managers
  # Uncomment this to add generic trials (without a card or plan)
  #
  # before_create do
  #   self.trial_ends_at = 14.days.from_now
  # end

  # If you need to create some associated records when an Account is created,
  # use a `with_tenant` block to change the current tenant temporarily
  #
  # after_create do
  #   ActsAsTenant.with_tenant(self) do
  #     association.create(name: "example")
  #   end
  # end
end
