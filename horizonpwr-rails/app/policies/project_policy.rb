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
    manage? ||
      project_attachments?
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
    user.can_view?("projects") ||
      user.can_manage?("proposals") ||
      manage?
  end

  def project_attachments?
    # TODO: refactor please. This is a hacky quick way to handle this. Do not reuse this.
    record.changed? == false
  end

  def manage?
    user.can_manage?("projects") ||
      admin?
  end

  relation_scope do |relation|
    halt unless user.active?
    next relation unless user.solar_installer? || user.sales?
    # TODO: Correct scope for managers and District Managers
    if user.solar_installer?
      relation.where(installer_id: user.accounts.impersonal.active.ids)
    else
      relation.where(account_id: user.accounts.impersonal)
    end
  end
end
