# == Schema Information
#
# Table name: projects
#
#  id                                :bigint           not null, primary key
#  battery                           :boolean
#  energy_efficiency_pack            :boolean
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  address_id                        :bigint
#  finance_partner_id                :bigint
#  installer_id                      :bigint
#  salesforce_opportunity_id         :string
#  salesforce_residential_project_id :string
#
# Indexes
#
#  index_projects_on_address_id          (address_id)
#  index_projects_on_finance_partner_id  (finance_partner_id)
#  index_projects_on_installer_id        (installer_id)
#
# Foreign Keys
#
#  fk_rails_...  (finance_partner_id => finance_partners.id)
#  fk_rails_...  (installer_id => installers.id)
#
require "test_helper"

class ProjectTest < ActiveSupport::TestCase
  setup do
    @project = projects(:one)
    @address = addresses(:one)
    @contact = contacts(:one)
    @installer = installers(:one)
    @appointment = appointments(:three)
  end

  class AddressSearchTest < ProjectTest
    test "address.address" do
      projects = Project.search_by_params(@address.address)

      assert_includes projects, @project
    end

    test "address.address_type" do
      projects = Project.search_by_params(@address.address_type)

      assert_includes projects, @project
    end

    test "address.city" do
      projects = Project.search_by_params(@address.city)

      assert_includes projects, @project
    end

    test "address.number" do
      projects = Project.search_by_params(@address.number)

      assert_includes projects, @project
    end

    test "address.postal_code" do
      projects = Project.search_by_params(@address.postal_code)

      assert_includes projects, @project
    end

    test "address.state" do
      projects = Project.search_by_params(@address.state)

      assert_includes projects, @project
    end

    test "address.street" do
      projects = Project.search_by_params(@address.street)

      assert_includes projects, @project
    end
  end

  class ContactsSearchTest < ProjectTest
    test "contacts.first_name" do
      projects = Project.search_by_params(@contact.first_name)

      assert_includes projects, @project
    end

    test "contacts.last_name" do
      projects = Project.search_by_params(@contact.last_name)

      assert_includes projects, @project
    end

    test "contacts.email" do
      projects = Project.search_by_params(@contact.email)

      assert_includes projects, @project
    end

    test "contacts.phone" do
      projects = Project.search_by_params(@contact.phone)

      assert_includes projects, @project
    end
  end

  class AppointmentSearchTest < ProjectTest
    test "appointment.appointment_type" do
      projects = Project.search_by_params(@appointment.appointment_type)

      assert_includes projects, @project
    end
  end

  class InstallerSearchTest < ProjectTest
    test "installer.name" do
      projects = Project.search_by_params(@installer.name)

      assert_includes projects, @project
    end
  end
end
