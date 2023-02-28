# Base class for application policies
class ApplicationPolicy < ActionPolicy::Base
  # Configure additional authorization contexts here
  # (`user` is added by default).
  #
  #   authorize :account, optional: true
  #
  # Read more about authorization context: https://actionpolicy.evilmartians.io/#/authorization_context

  def admin?
    user.admin?
  end

  private

  # Define shared methods useful for most policies.
  # For example:
  #

  def owner?
    record.is_a?(ApplicationRecord) ? record.user_id == user.id : false
  end
end
