# == Schema Information
#
# Table name: contact_appointments
#
#  id             :bigint           not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  address_id     :bigint
#  appointment_id :bigint           not null
#  contact_id     :bigint           not null
#  project_id     :bigint
#
# Indexes
#
#  index_contact_appointments_on_address_id      (address_id)
#  index_contact_appointments_on_appointment_id  (appointment_id)
#  index_contact_appointments_on_contact_id      (contact_id)
#  index_contact_appointments_on_project_id      (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (appointment_id => appointments.id)
#  fk_rails_...  (contact_id => contacts.id)
#  fk_rails_...  (project_id => projects.id)
#
require "test_helper"

class ContactAppointmentTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
