# == Schema Information
#
# Table name: incoming_webhooks
#
#  id           :bigint           not null, primary key
#  event_type   :string
#  has_been_run :boolean          default(FALSE), not null
#  payload      :jsonb            not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class IncomingWebhook < ApplicationRecord
  def hook_args
    {IncomingWebhook: id}
  end
end
