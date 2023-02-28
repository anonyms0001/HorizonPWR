class NotePolicy < ApplicationPolicy
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
    manage?
  end

  def new?
    true
  end

  def create?
    new?
  end

  def destroy?
    manage?
  end

  def manage?
    index_safe? && owner? ||
      user.can_manage_all_project_notes? ||
      admin?
  end

  def view?
    user.can_view?("all_project_notes") ||
      user.can_manage?("projects") ||
      user.can_manage?("proposals") ||
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
