class FundingPolicy < ApplicationPolicy
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

  def edit?
    update?
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
    user.can_manage?("fundings") ||
      admin?
  end

  def view?
    user.can_view?("fundings") ||
      manage? # ||
    # owner?
  end

  # def owner?
  #    (record.class == Class) ? false : record.created_by_id == user.id
  # end
  #
  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if user.admin?
  #   relation.where(user: user)
  # end
end
