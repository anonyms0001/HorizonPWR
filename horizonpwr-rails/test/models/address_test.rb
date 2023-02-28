# == Schema Information
#
# Table name: addresses
#
#  id                        :bigint           not null, primary key
#  address                   :string
#  address_type              :string
#  archived                  :boolean          default(FALSE), not null
#  city                      :string
#  latitude                  :decimal(, )
#  longitude                 :decimal(, )
#  number                    :string
#  postal_code               :string
#  state                     :string
#  street                    :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  canvass_address_id        :string
#  salesforce_lead_id        :string
#  salesforce_opportunity_id :string
#
# Indexes
#
#  index_addresses_on_canvass_address_id         (canvass_address_id)
#  index_addresses_on_salesforce_lead_id         (salesforce_lead_id)
#  index_addresses_on_salesforce_opportunity_id  (salesforce_opportunity_id)
#
require "test_helper"

class AddressTest < ActiveSupport::TestCase
  setup do
    @address = addresses(:one)
    @contact = contacts(:one)
  end

  class AddressSearchTest < AddressTest
    test "address.address" do
      addresses = Address.search_by_params(@address.address)

      assert_includes addresses, @address
    end

    test "address.address_type" do
      addresses = Address.search_by_params(@address.address_type)

      assert_includes addresses, @address
    end

    test "address.city" do
      addresses = Address.search_by_params(@address.city)

      assert_includes addresses, @address
    end

    test "address.number" do
      addresses = Address.search_by_params(@address.number)

      assert_includes addresses, @address
    end

    test "address.postal_code" do
      addresses = Address.search_by_params(@address.postal_code)

      assert_includes addresses, @address
    end

    test "address.state" do
      addresses = Address.search_by_params(@address.state)

      assert_includes addresses, @address
    end

    test "address.street" do
      addresses = Address.search_by_params(@address.street)

      assert_includes addresses, @address
    end
  end

  class ContactSearchTest < AddressTest
    test "contacts.first_name" do
      addresses = Address.search_by_params(@contact.first_name)

      assert_includes addresses, @address
    end

    test "contacts.last_name" do
      addresses = Address.search_by_params(@contact.last_name)

      assert_includes addresses, @address
    end

    test "contacts.email" do
      addresses = Address.search_by_params(@contact.email)

      assert_includes addresses, @address
    end

    test "contacts.phone" do
      addresses = Address.search_by_params(@contact.phone)

      assert_includes addresses, @address
    end
  end
end
