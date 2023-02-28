module UsersHelper
  def active_user_signed_in?
    user_signed_in? && current_user.active?
  end

  # def current_user_admin
end
