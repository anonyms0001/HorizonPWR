class FormConfigPolicy < ApplicationPolicy
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
    manage?
  end

  def manage?
    user.can_manage?("dynamic_forms") ||
      user.can_manage?("form_configs") ||
      admin?
  end

  def view?
    user.can_view?("dynamic_forms") ||
      user.can_view?("form_configs") ||
      manage?
  end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if user.admin?
  #   relation.where(user: user)
  # end
end
