class UplineRelationPolicy < ApplicationPolicy
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
    user.can_manage?("upline_relations") ||
      admin?
  end

  def view?
    user.can_view?("upline_relations") ||
      manage? ||
      owner?
  end

  def owner?
    record.is_a?(UplineRelation) ? record.created_by_id == user.id : false
  end
  #
  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if user.admin?
  #   relation.where(user: user)
  # end
end
