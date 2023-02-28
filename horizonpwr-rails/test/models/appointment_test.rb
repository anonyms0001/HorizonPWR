# == Schema Information
#
# Table name: appointments
#
#  id                                :bigint           not null, primary key
#  appointment_status                :string           default("scheduled"), not null
#  appointment_status_reason         :string
#  appointment_subtype               :string
#  appointment_type                  :string           not null
#  archived                          :boolean          default(FALSE), not null
#  completed_at                      :datetime
#  end_at                            :datetime
#  failed                            :boolean
#  held                              :boolean
#  held_at                           :datetime
#  held_reason                       :string
#  source                            :string           default("pwrstation")
#  start_at                          :datetime
#  task_completion                   :jsonb            not null
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  account_id                        :bigint
#  address_id                        :bigint
#  canvass_appointment_id            :string
#  consult_id                        :bigint
#  created_by_id                     :bigint
#  created_by_position_id            :bigint
#  held_by_id                        :bigint
#  installer_account_id              :bigint
#  project_id                        :bigint
#  salesforce_opportunity_id         :string
#  salesforce_residential_project_id :string
#  scheduled_with_id                 :bigint
#
# Indexes
#
#  index_appointments_on_account_id                         (account_id)
#  index_appointments_on_address_id                         (address_id)
#  index_appointments_on_canvass_appointment_id             (canvass_appointment_id)
#  index_appointments_on_consult_id                         (consult_id)
#  index_appointments_on_created_by_id                      (created_by_id)
#  index_appointments_on_created_by_position_id             (created_by_position_id)
#  index_appointments_on_held_by_id                         (held_by_id)
#  index_appointments_on_installer_account_id               (installer_account_id)
#  index_appointments_on_project_id                         (project_id)
#  index_appointments_on_salesforce_opportunity_id          (salesforce_opportunity_id)
#  index_appointments_on_salesforce_residential_project_id  (salesforce_residential_project_id)
#  index_appointments_on_scheduled_with_id                  (scheduled_with_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (consult_id => appointments.id)
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (created_by_position_id => job_positions.id)
#  fk_rails_...  (held_by_id => users.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (scheduled_with_id => users.id)
#
require "test_helper"

class AppointmentTest < ActiveSupport::TestCase
  setup do
    @appointment = appointments(:one)
    @address = addresses(:one)
    @consultant = users(:two)
    @contact = contacts(:one)
  end

  test "will call correct scheduled_with_consultant" do
    assert_equal @consultant.id, @appointment.scheduled_with_consultant.id
  end

  test "will set installer account id" do
    @appointment = appointments(:three)

    assert_nil @appointment.installer_account_id
    @appointment.save!
    assert_not_nil @appointment.installer_account_id
  end

  test "will set completed_at" do
    @appointment = appointments(:three)

    assert_nil @appointment.completed_at
    @appointment.update!(task_completion: {paneling: true, commissioning: true})
    @appointment.save!
    assert_not_nil @appointment.completed_at
  end

  class AddressSearchTest < AppointmentTest
    test "address.address" do
      appointments = Appointment.search_by_params(@address.address)

      assert_includes appointments, @appointment
    end

    test "address.address_type" do
      appointments = Appointment.search_by_params(@address.address_type)

      assert_includes appointments, @appointment
    end

    test "address.city" do
      appointments = Appointment.search_by_params(@address.city)

      assert_includes appointments, @appointment
    end

    test "address.number" do
      appointments = Appointment.search_by_params(@address.number)

      assert_includes appointments, @appointment
    end

    test "address.postal_code" do
      appointments = Appointment.search_by_params(@address.postal_code)

      assert_includes appointments, @appointment
    end

    test "address.state" do
      appointments = Appointment.search_by_params(@address.state)

      assert_includes appointments, @appointment
    end

    test "address.street" do
      appointments = Appointment.search_by_params(@address.street)

      assert_includes appointments, @appointment
    end
  end

  class ContactsSearchTest < AppointmentTest
    test "contacts.first_name" do
      appointments = Appointment.search_by_params(@contact.first_name)

      assert_includes appointments, @appointment
    end

    test "contacts.last_name" do
      appointments = Appointment.search_by_params(@contact.last_name)

      assert_includes appointments, @appointment
    end

    test "contacts.email" do
      appointments = Appointment.search_by_params(@contact.email)

      assert_includes appointments, @appointment
    end

    test "contacts.phone" do
      appointments = Appointment.search_by_params(@contact.phone)

      assert_includes appointments, @appointment
    end
  end

  class CreatedBySearchTest < AppointmentTest
    def setup
      super
      @created_by = users(:one)
    end

    test "created_by.first_name" do
      appointments = Appointment.search_by_params(@created_by.first_name)

      assert_includes appointments, @appointment
    end

    test "created_by.last_name" do
      appointments = Appointment.search_by_params(@created_by.last_name)

      assert_includes appointments, @appointment
    end

    test "created_by.email" do
      appointments = Appointment.search_by_params(@created_by.email)

      assert_includes appointments, @appointment
    end

    test "created_by.phone" do
      appointments = Appointment.search_by_params(@created_by.phone)

      assert_includes appointments, @appointment
    end
  end

  class ScheduledWithSearchTest < AppointmentTest
    def setup
      super
      @scheduled_with = users(:two)
    end

    test "scheduled_with.first_name" do
      appointments = Appointment.search_by_params(@scheduled_with.first_name)

      assert_includes appointments, @appointment
    end

    test "scheduled_with.last_name" do
      appointments = Appointment.search_by_params(@scheduled_with.last_name)

      assert_includes appointments, @appointment
    end

    test "scheduled_with.email" do
      appointments = Appointment.search_by_params(@scheduled_with.email)

      assert_includes appointments, @appointment
    end

    test "scheduled_with.phone" do
      appointments = Appointment.search_by_params(@scheduled_with.phone)

      assert_includes appointments, @appointment
    end
  end

  class AccountSearchTest < AppointmentTest
    def setup
      super
      @account = accounts(:one)
    end

    test "account.name" do
      appointments = Appointment.search_by_params(@account.name)

      assert_includes appointments, @appointment
    end
  end
end
