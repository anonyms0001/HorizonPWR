class AccountPolicy < ApplicationPolicy
  # See https://actionpolicy.evilmartians.io/#/writing_policies
  #
  def index?
    admin?
  end

  def update?
    manage?
  end

  def edit?
    manage?
  end

  def show?
    view?
  end

  def create?
    admin?
  end

  def new?
    admin?
  end

  def manage?
    account_user = AccountUser.find_by(account: record, user: user)
    admin? || account_user&.manager? || account_user&.default_manager? || account_user&.admin? # || (user.id == record.user_id)
  end

  def view?
    true
  end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if admin?
  #   relation.where(user: user)
  # end
end
