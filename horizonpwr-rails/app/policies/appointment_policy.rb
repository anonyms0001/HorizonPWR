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
    manage? ||
      # Sales reps can create site audits
      (record.site_audit? || record.follow_up?) && user.closer? && user.accounts.impersonal.include?(record.account)
  end

  def view?
    user.can_view?("appointments") ||
      manage?
  end

  def can_switch_scheduled_with?
    # Sales Support can change the Scheduled With, if needed.
    user.support? ||
      # Closers can change the scheduled_with to themselves.
      record.is_a?(ApplicationRecord) && record.account.closers.include?(user)
  end

  def manage?
    # TODO: Something is wrong with the way we have to find out if it is a class or not. leftnav is causing some of this
    unless can_switch_scheduled_with?
      return false if record.is_a?(ApplicationRecord) && record.appointment_type == "consult"
    end
    user.can_manage?("appointments") ||
      can_switch_scheduled_with? ||
      admin?
  end

  # Scoping
  # See https://actionpolicy.evilmartians.io/#/scoping
  #
  relation_scope do |relation|
    next relation if user.admin? || user.job_position_id == 5
    # TODO: Correct scope for managers and District Managers
    if User.closers.include?(user)
      relation.where(account_id: user.accounts.impersonal.map(&:id))
    elsif User.solar_installers.include?(user)
      relation.where(installer_account_id: user.accounts.impersonal.map(&:id))
    else
      relation.where("created_by_id = ? OR scheduled_with_id = ?", user.id, user.id)
    end
  end

  scope_for :relation do |relation|
    next relation.none unless user.active?
    next relation if user.admin? || user.job_position_id == 5
    # TODO: Correct scope for managers and District Managers
    if User.closers.include?(user)
      relation.where(account_id: user.accounts.impersonal.first)
    elsif User.solar_installers.include?(user)
      user_team_ids = user.accounts.impersonal.map(&:id)
      appointment_ids = relation.map { |appt| appt.id if user_team_ids.include?(appt.find_installer_account_id) }.uniq.reject(&:blank?)
      relation.where(id: appointment_ids)
    else
      relation.where("created_by_id = ? OR scheduled_with_id = ?", user.id, user.id)
    end
  end
end
