class AttachmentPolicy < ApplicationPolicy
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

  def destroy?
    manage?
  end

  def view?
    user.can_view?("attachments") ||
      manage?
  end

  def manage?
    user.can_manage?("attachments") ||
      admin? ||
      record.record&.is_a?(Proposal) && User.sales.include?(user)
  end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  # relation_scope do |relation|
  #   next relation if user.admin?
  #   relation.where(user: user)
  # end
end
