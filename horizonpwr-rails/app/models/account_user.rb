# == Schema Information
#
# Table name: account_users
#
#  id                    :bigint           not null, primary key
#  roles                 :jsonb            not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  account_id            :bigint
#  default_consultant_id :bigint
#  user_id               :bigint
#
# Indexes
#
#  index_account_users_on_account_id             (account_id)
#  index_account_users_on_default_consultant_id  (default_consultant_id)
#  index_account_users_on_user_id                (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (default_consultant_id => users.id)
#  fk_rails_...  (user_id => users.id)
#

class AccountUser < ApplicationRecord
  # Add account roles to this line
  # Do NOT to use any reserved words like `user` or `account`
  ROLES = [:admin, :default_manager, :manager, :member, :project_manager]

  belongs_to :account
  belongs_to :user
  belongs_to :default_consultant, class_name: "User", optional: true

  validates :user_id, uniqueness: {scope: :account_id}
  validate :owner_must_be_admin, on: :update, if: -> { admin_changed? && account_owner? }
  # scope :active, -> { where(active: true) } This is actually on a user, not an account user. There needs to be a way to specify which account user is the default or the active account user for the given user

  scope :with_active_user, -> { includes(:user).where(user: {active: true}) }

  # Store the roles in the roles json column and cast to booleans
  store_accessor :roles, *ROLES

  # Cast roles to/from booleans
  ROLES.each do |role|
    scope role.to_s.pluralize, -> { where("roles @> ?", {role => true}.to_json) }

    define_method(:"#{role}=") { |value| super ActiveRecord::Type::Boolean.new.cast(value) }
    define_method(:"#{role}?") { send(role) }
  end

  # You can use Postgres' jsonb operators to query the roles jsonb column
  # https://www.postgresql.org/docs/current/functions-json.html
  #
  # Query where roles contains:
  # scope :managers, -> {where("roles @> ?", {manager: true}.to_json)}
  # scope :default_manager, -> {where("roles @> ?", {default_manager: true}.to_json)}

  def self.account_default_manager(account)
    default_managers.find_by(account: account)&.user || chief_executive_officer
  end

  def name
    user.name
  end

  def default_energy_consultant
    # TODO: Is AccountUser.chief_executive_officer correct syntax? Should AccountUser be removed?
    default_consultant || AccountUser.account_default_manager(account) || AccountUser.chief_executive_officer
  end

  def self.chief_executive_officer
    Honeybadger.notify("Someone called the CEO method!")
    User.find_by(email: "judd@horizonpwr.com")
  end

  def can_edit_role?(user, role)
    # TODO: What is this doing here?
    role == :admin &&
      account_owner? && !user.admin? ||
      role == :default_manager &&
        (!!default_manager? || !user.admin?)
  end

  def active_roles
    ROLES.select { |role| send(:"#{role}?") }.compact
  end

  def account_owner?
    account.owner_id == user_id
  end

  def owner_must_be_admin
    unless admin?
      errors.add :admin, :cannot_be_removed
    end
  end

  def remove_other_default_managers
    if default_manager?
      account_users = AccountUser.default_managers.where(account: account).where.not(id: id)
      account_users.each do |account_user|
        account_user.default_manager = false
        account_user.save
      end
    else
      true
    end
  end
end
