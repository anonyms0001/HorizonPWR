class ProjectPolicy < ApplicationPolicy
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
    create?
  end

  def create?
    view?
  end

  def view?
    user.can_view?("project") ||
      user.can_manage?("proposals") ||
      manage?
  end

  def manage?
    user.can_manage?("projects") ||
      admin?
  end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if admin?
  #   relation.where(user: user)
  # end
end
