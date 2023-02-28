class UserPolicy < ApplicationPolicy
  # See https://actionpolicy.evilmartians.io/#/writing_policies
  #
  def index?
    view?
  end

  def edit?
    manage?
  end

  def update?
    manage?
  end

  def show?
    view?
  end

  def new?
    manage?
  end

  def create?
    manage?
  end

  def destroy?
    false
  end

  def view?
    true
  end

  def manage?
    user.can_manage?("users") ||
      admin?
  end

  def manage_custom?
    user.can_manage?("users_custom") ||
      admin?
  end

  def view_details?
    (User.active.sales_managers.include?(user) && User.active.sales.include?(record)) ||
      !User.sales.include?(user) ||
      admin?
  end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if user.admin?
  #   relation.where(user: user)
  # end
end
