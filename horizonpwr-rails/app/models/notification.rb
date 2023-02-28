# == Schema Information
#
# Table name: notifications
#
#  id             :bigint           not null, primary key
#  interacted_at  :datetime
#  params         :jsonb
#  read_at        :datetime
#  recipient_type :string           not null
#  type           :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  account_id     :bigint
#  recipient_id   :bigint           not null
#
# Indexes
#
#  index_notifications_on_account_id                       (account_id)
#  index_notifications_on_recipient_type_and_recipient_id  (recipient_type,recipient_id)
#
class Notification < ApplicationRecord
  include Noticed::Model

  belongs_to :account, optional: true

  def self.statuses
    ["unread"]
  end

  def self.mark_as_interacted!
    update(interacted_at: Time.current, updated_at: Time.current)
  end

  def mark_as_interacted!
    update(interacted_at: Time.current)
  end

  def mark_thread_as_read!
    if params[:appointment].present?
      user_notifications = Notification.where(recipient_type: "User", recipient_id: current_user.id, interacted_at: nil)
      this_notification = user_notifications.map { |x| x.id if x.params[:appointment] == params[:appointment] }
      thread_members = Notification.where(id: this_notification)
    else
      thread_members = Notification.where(recipient_type: "User", recipient_id: current_user.id, params: params, interacted_at: nil)
    end
    thread_members.update_all(read_at: Time.current, updated_at: Time.current, interacted_at: Time.current)
    # NOTE: update_all does not seem to save, so we save changes here:
    thread_members.map(&:save)
  end
end
