class ApplicationNotification < Noticed::Base
  # Delivery methods and helpers used by all notifications can be defined here.
  deliver_by :database, format: :to_database

  # Include the user's personal account by default, but allow overriding with params
  def to_database
    {
      type: self.class.name,
      params: params.except(:account)
    }
  end
end
