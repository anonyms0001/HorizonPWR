class InstallerPolicy < ApplicationPolicy
  # See https://actionpolicy.evilmartians.io/#/writing_policies
  #
  def index?
    view?
  end

  def show?
    view?
  end

  def edit?
    manage?
  end

  def update?
    manage?
  end

  def create?
    manage?
  end

  def destroy?
    admin?
  end

  def manage?
    user.can_manage?("installers") ||
      admin?
  end

  def view?
    user.can_view?("installers") ||
      user.can_manage?("installers") ||
      admin?
  end

  # def owner?
  #   record.is_a?(Installer) ? record.created_by_id == user.id : false
  # end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if user.admin?
  #   relation.where(user: user)
  # end
end
