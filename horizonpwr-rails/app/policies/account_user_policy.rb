class AccountUserPolicy < ApplicationPolicy
  # See https://actionpolicy.evilmartians.io/#/writing_policies
  #
  def update?
    manage?
  end

  def edit?
    manage?
  end

  def manage?
    account_user = AccountUser.find_by(account: record.account, user: user.id)
    user.admin? ||
      account_user&.admin? ||
      account_user&.manager? ||
      account_user&.default_manager?
  end

  def view?
    true
  end
  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if user.admin?
  #   relation.where(user: user)
  # end
end
