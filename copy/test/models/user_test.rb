# == Schema Information
#
# Table name: users
#
#  id                           :bigint           not null, primary key
#  accepted_privacy_at          :datetime
#  accepted_terms_at            :datetime
#  active                       :boolean          default(FALSE)
#  admin                        :boolean
#  announcements_read_at        :datetime
#  birth_date                   :date
#  confirmation_sent_at         :datetime
#  confirmation_token           :string
#  confirmed_at                 :datetime
#  email                        :string           default(""), not null
#  encrypted_password           :string           default(""), not null
#  end_date                     :date
#  end_reason                   :string
#  extra_salesforce_account_ids :text             default([]), is an Array
#  first_name                   :string
#  invitation_accepted_at       :datetime
#  invitation_created_at        :datetime
#  invitation_limit             :integer
#  invitation_sent_at           :datetime
#  invitation_token             :string
#  invitations_count            :integer          default(0)
#  invited_by_type              :string
#  last_name                    :string
#  last_otp_timestep            :integer
#  otp_backup_codes             :text
#  otp_required_for_login       :boolean
#  otp_secret                   :string
#  permissions                  :jsonb            not null
#  personal_email               :string
#  phone                        :string
#  preferred_language           :string
#  remember_created_at          :datetime
#  reset_password_sent_at       :datetime
#  reset_password_token         :string
#  shirt_size                   :string
#  shoe_size                    :string
#  start_date                   :date
#  time_zone                    :string
#  unconfirmed_email            :string
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  canvass_user_id              :string
#  invited_by_id                :bigint
#  job_position_id              :bigint
#  salesforce_account_id        :string
#
# Indexes
#
#  index_users_on_email                              (email) UNIQUE
#  index_users_on_invitation_token                   (invitation_token) UNIQUE
#  index_users_on_invitations_count                  (invitations_count)
#  index_users_on_invited_by_id                      (invited_by_id)
#  index_users_on_invited_by_type_and_invited_by_id  (invited_by_type,invited_by_id)
#  index_users_on_job_position_id                    (job_position_id)
#  index_users_on_reset_password_token               (reset_password_token) UNIQUE
#

require "test_helper"

class UserTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)
    @account = accounts(:one)
    @job_position = job_positions(:one)
  end

  test "user has many accounts" do
    user = users(:one)
    assert_includes user.accounts, accounts(:one)
    assert_includes user.accounts, accounts(:impersonal)
  end

  test "user has a personal account" do
    user = users(:one)
    assert_equal accounts(:personal), user.personal_account
  end

  class UserSearchTest < UserTest
    test "user.first_name" do
      users = User.search_by_params(@user.first_name)

      assert_includes users, @user
    end

    test "user.last_name" do
      users = User.search_by_params(@user.last_name)

      assert_includes users, @user
    end
  end

  class AccountSearchTest < UserTest
    test "account.name" do
      users = User.search_by_params(@account.name)

      assert_includes users, @user
    end
  end

  class JobPositionSearchTest < UserTest
    test "job_position.name" do
      users = User.search_by_params(@job_position.name)

      assert_includes users, @user
    end
  end
end
