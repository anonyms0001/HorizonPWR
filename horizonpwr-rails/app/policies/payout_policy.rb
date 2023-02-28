class PayoutPolicy < ApplicationPolicy
  # See https://actionpolicy.evilmartians.io/#/writing_policies
  #
  def index?
    view?
  end

  def show?
    view?
  end

  def update?
    manage?
  end

  def create?
    manage?
  end

  def destroy?
    manage?
  end

  def manage?
    user.can_manage?("payouts") ||
      admin?
  end

  def view?
    user.can_view?("payouts") ||
      manage? ||
      owner?
  end

  def owner?
    record.instance_of?(Class) || record == [] ? false : record.user_id == user.id ||
      manage?
  end
  #
  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  relation_scope do |relation|
    next relation if manage?
    if User.sales_managers.include?(user)
      users = []
      user.accounts.impersonal.each do |account|
        users << account.account_users.includes(:user).map(&:user)
      end
      relation.where(user_id: users.flatten.uniq.map(&:id))
    else
      relation.where(user: user)
    end
  end
end
