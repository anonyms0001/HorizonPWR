class AppointmentPolicy < ApplicationPolicy
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

  def view?
    user.can_view?("appointments") ||
      manage?
  end

  def manage?
    user.can_manage?("appointments") ||
      admin?
  end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  relation_scope do |relation|
    next relation if user.admin? || user.job_position_id == 5
    # TODO: Correct scope for managers and District Managers
    relation.where(account_id: user.accounts.impersonal.first) if user.job_position_id == 8 || user.job_position_id == 3
    relation.where("created_by_id = ? OR scheduled_with_id = ?", user.id, user.id)
  end
end
