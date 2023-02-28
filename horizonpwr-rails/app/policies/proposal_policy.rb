class ProposalPolicy < ApplicationPolicy
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
    manage?
  end

  def create?
    manage?
  end

  def destroy?
    manage?
  end

  def view?
    user.can_view?("proposals") ||
      user.can_manage?("projects") ||
      manage?
  end

  def manage?
    user.can_manage?("proposals") ||
      admin?
  end

  def custom_manage?
    user.can_manage?("proposals_custom") ||
      admin?
  end

  def project_attachments?
    # TODO: refactor please. This is a hacky quick way to handle this. Do not reuse this.
    record.changed? == false
  end

  def view_details?
    view? &&
      !User.sales.include?(user)
  end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  relation_scope do |relation|
    next relation if user.admin?
    next relation if User.sales.exclude?(user)
    if User.field_marketers.include?(user)
      appointment_ids = Appointment.where(created_by_id: user.id).or(Appointment.where(scheduled_with_id: user.id))
      relation.where(appointment_id: appointment_ids)
    else
      user_account_ids = user.accounts.impersonal.map(&:id)
      # NOTE: .map returns an array, which breaks Pagy. We do this in order to return an ActiveRecord::Relation.
      relation.where(id: relation.map { |i| i.id if user_account_ids.include?(i.appointment.account_id) })
    end
  end
end
