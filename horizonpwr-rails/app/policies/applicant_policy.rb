class ApplicantPolicy < ApplicationPolicy
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
    true
  end

  def create?
    true
  end

  def destroy?
    manage?
  end

  def view?
    user.can_view?("applicants") ||
      manage? ||
      owner?
  end

  def manage?
    user.can_manage?("applicants") ||
      admin?
  end

  def manage_custom?
    user.can_manage?("applicants_custom") ||
      admin?
  end

  def view_links?
    admin? ||
      User.hr.include?(user)
  end

  # def owner?
  #    (record.class == Class) ? false : record.created_by_id == user.id
  # end
  #
  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  relation_scope do |relation|
    next relation if user.admin? || user.job_position&.name == "Human Resources"
    sales_jobs = Department.first.job_positions.ids
    if user.job_position&.name == "Regional Manager"
      relation.where(job_position_id: sales_jobs)
    else
      relation.where(account_id: (user.accounts.impersonal.ids << nil), created_by: [nil, user.id], job_position_id: sales_jobs)
    end
  end
end
