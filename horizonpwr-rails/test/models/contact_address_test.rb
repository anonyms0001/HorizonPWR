# == Schema Information
#
# Table name: contact_addresses
#
#  id              :bigint           not null, primary key
#  primary_contact :boolean
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  address_id      :bigint           not null
#  contact_id      :bigint           not null
#  project_id      :bigint
#
# Indexes
#
#  index_contact_addresses_on_address_id  (address_id)
#  index_contact_addresses_on_contact_id  (contact_id)
#  index_contact_addresses_on_project_id  (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (contact_id => contacts.id)
#  fk_rails_...  (project_id => projects.id)
#
require "test_helper"

class ContactAddressTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
