class NotePolicy < ApplicationPolicy
  # See https://actionpolicy.evilmartians.io/#/writing_policies
  #
  def index?
    admin?
  end

  def show?
    view?
  end

  def update?
    manage?
  end

  def edit?
    manage?
  end

  def new?
    manage?
  end

  def create?
    new?
  end

  def destroy?
    manage?
  end

  def manage?
    index_safe? && owner? ||
      user.can_manage?("applicants") ||
      user.can_manage?("appointments") ||
      user.can_manage_all_project_notes? ||
      user.solar_installer? && installer_account_owns_note? ||
      admin?
  end

  def installer_account_owns_note?
    user.accounts.impersonal.map { |n| n.owns_note?(record) }.include?(true)
  end

  def view?
    user.can_view?("all_project_notes") ||
      user.can_manage?("projects") ||
      user.can_manage?("proposals") ||
      user.can_manage?("appointments") ||
      mentioned? ||
      manage? ||
      record.parent_record.notable_type == "Feedback"
  end

  def mentioned?
    index_safe? && NoteUserPermission.find_by(note: record.parent_record, user: user).present?
  end

  def index_safe?
    record.instance_of?(Note)
  end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if user.admin?
  #   relation.where(user: user)
  # end
end
