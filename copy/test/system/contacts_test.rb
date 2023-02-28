require "application_system_test_case"

class ContactsTest < ApplicationSystemTestCase
  setup do
    @contact = contacts(:one)
    @user = users(:one)
    login_as @user
    @address = addresses(:one)
  end

  test "visiting the index" do
    visit contacts_url
    assert_selector "a", text: "FIRST NAME"
  end

  # test "creating a Contact" do
  #   visit contacts_url
  #   click_on "New Contact"
  #
  #   fill_in "Email", with: @contact.email
  #   fill_in "First name", with: @contact.first_name
  #   fill_in "Last name", with: @contact.last_name
  #   fill_in "Phone", with: @contact.phone
  #   click_on "Create Contact"
  #
  #   assert_text "Contact was successfully created"
  #   assert_selector "h1", text: "Contacts"
  # end

  test "updating a Contact" do
    visit contact_url(@contact)
    click_on "Edit", match: :first

    fill_in "Email", with: @contact.email
    fill_in "First name", with: @contact.first_name
    fill_in "Last name", with: @contact.last_name
    fill_in "Phone", with: @contact.phone
    click_on "Update Contact"

    assert_text "Contact was successfully updated"
  end

  test "destroying a Contact" do
    visit edit_contact_url(@contact)
    click_on "Delete", match: :first
  end

  class AddressSearchTest < ContactsTest
    test "address.address" do
      contacts = Contact.search_by_params(@address.address)

      assert_includes contacts, @contact
    end

    test "address.address_type" do
      contacts = Contact.search_by_params(@address.address_type)

      assert_includes contacts, @contact
    end

    test "address.city" do
      contacts = Contact.search_by_params(@address.city)

      assert_includes contacts, @contact
    end

    test "address.number" do
      contacts = Contact.search_by_params(@address.number)

      assert_includes contacts, @contact
    end

    test "address.postal_code" do
      contacts = Contact.search_by_params(@address.postal_code)

      assert_includes contacts, @contact
    end

    test "address.state" do
      contacts = Contact.search_by_params(@address.state)

      assert_includes contacts, @contact
    end

    test "address.street" do
      contacts = Contact.search_by_params(@address.street)

      assert_includes contacts, @contact
    end
  end

  class ContactSearchTest < ContactsTest
    test "contacts.first_name" do
      contacts = Contact.search_by_params(@contact.first_name)

      assert_includes contacts, @contact
    end

    test "contacts.last_name" do
      contacts = Contact.search_by_params(@contact.last_name)

      assert_includes contacts, @contact
    end

    test "contacts.email" do
      contacts = Contact.search_by_params(@contact.email)

      assert_includes contacts, @contact
    end

    test "contacts.phone" do
      contacts = Contact.search_by_params(@contact.phone)

      assert_includes contacts, @contact
    end
  end
end
