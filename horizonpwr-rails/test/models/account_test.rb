# == Schema Information
#
# Table name: accounts
#
#  id                        :bigint           not null, primary key
#  active                    :boolean          default(FALSE)
#  card_exp_month            :string
#  card_exp_year             :string
#  card_last4                :string
#  card_type                 :string
#  domain                    :string
#  extra_billing_info        :text
#  historic_canvass_team_ids :text             default([]), is an Array
#  name                      :string           not null
#  personal                  :boolean          default(FALSE)
#  processor                 :string
#  subdomain                 :string
#  trial_ends_at             :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  canvass_team_id           :string
#  installer_id              :bigint
#  owner_id                  :bigint
#  processor_id              :string
#
# Indexes
#
#  index_accounts_on_installer_id  (installer_id)
#  index_accounts_on_owner_id      (owner_id)
#
# Foreign Keys
#
#  fk_rails_...  (installer_id => installers.id)
#  fk_rails_...  (owner_id => users.id)
#
require "test_helper"

class AccountTest < ActiveSupport::TestCase
  test "validates against reserved domains" do
    account = Account.new(domain: Jumpstart.config.domain)
    assert_not account.valid?
    assert_not_empty account.errors[:domain]
  end

  test "validates against reserved subdomains" do
    subdomain = Account::RESERVED_SUBDOMAINS.first
    account = Account.new(subdomain: subdomain)
    assert_not account.valid?
    assert_not_empty account.errors[:subdomain]
  end

  test "subdomain format must start with alphanumeric char" do
    account = Account.new(subdomain: "-abcd")
    assert_not account.valid?
    assert_not_empty account.errors[:subdomain]
  end

  test "subdomain format must end with alphanumeric char" do
    account = Account.new(subdomain: "abcd-")
    assert_not account.valid?
    assert_not_empty account.errors[:subdomain]
  end

  test "must be at least two characters" do
    account = Account.new(subdomain: "a")
    assert_not account.valid?
    assert_not_empty account.errors[:subdomain]
  end

  test "can use a mixture of alphanumeric, hyphen, and underscore" do
    [
      "ab",
      "12",
      "a-b",
      "a-9",
      "1-2",
      "1_2",
      "a_3"
    ].each do |subdomain|
      account = Account.new(subdomain: subdomain)
      account.valid?
      assert_empty account.errors[:subdomain]
    end
  end

  # TODO: https://github.com/bblimke/webmock#stubbing
  #       I have skipped the tests below for the following reason:
  #       It wants to initialize the CanvassClient in order to run User.fix_appointments_created_by. BUT a) there are no
  #       test credentials for Canvass; b) our test data wouldn't be in Canvass; c) the appointments don't need fixing.
  #       We should either create a mock response, or unskip these when we no longer need those methods.
  test "personal accounts enabled" do
    skip
    Jumpstart.config.stub(:personal_accounts, true) do
      user = User.create! name: "Test", email: "personalaccounts@horizonpwr.com", password: "password", password_confirmation: "password", terms_of_service: true, job_position: job_positions(:fm)
      assert user.accounts.first.personal?
    end
  end

  test "personal accounts disabled" do
    skip
    Jumpstart.config.stub(:personal_accounts, false) do
      user = User.create! name: "Test", email: "nonpersonalaccounts@horizonpwr.com", password: "password", password_confirmation: "password", terms_of_service: true, job_position: job_positions(:fm)
      assert_not user.accounts.first.personal?
    end
  end

  test "owner?" do
    account = accounts(:one)
    assert account.owner?(users(:one))
    refute account.owner?(users(:two))
  end

  # This is not something we plan to have
  test "can_transfer? false for personal accounts" do
    skip
    refute accounts(:one).can_transfer?(users(:one))
  end

  # This is not something we plan to have
  test "can_transfer? true for owner" do
    skip
    account = accounts(:company)
    assert account.can_transfer?(account.owner)
  end

  test "can_transfer? false for non-owner" do
    refute accounts(:company).can_transfer?(users(:two))
  end

  # This is not something we plan to have
  test "transfer ownership to a new owner" do
    skip
    account = accounts(:company)
    new_owner = users(:two)
    assert accounts(:company).transfer_ownership(new_owner.id)
    assert_equal new_owner, account.reload.owner
  end

  test "transfer ownership fails transferring to a user outside the account" do
    account = accounts(:company)
    owner = account.owner
    refute account.transfer_ownership(users(:invited).id)
    assert_equal owner, account.reload.owner
  end
end
