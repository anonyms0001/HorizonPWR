class ContactPolicy < ApplicationPolicy
  # See https://actionpolicy.evilmartians.io/#/writing_policies
  #
  def index?
    view?
  end

  def update?
    view?
  end

  def edit?
    view?
  end

  def show?
    view?
  end

  def create?
    view?
  end

  def new?
    view?
  end

  def destroy?
    manage?
  end

  def manage?
    user.can_manage?("contacts") ||
      admin?
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
