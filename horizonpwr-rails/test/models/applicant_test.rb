# == Schema Information
#
# Table name: applicants
#
#  id                       :bigint           not null, primary key
#  email                    :string
#  first_name               :string
#  last_name                :string
#  middle_initial           :string
#  new_email                :string
#  phone                    :string
#  previously_employed_here :boolean
#  start_date               :datetime
#  status                   :string           default("new")
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  account_id               :bigint
#  canvass_user_id          :bigint
#  created_by_id            :bigint
#  dynamic_form_id          :bigint
#  job_position_id          :bigint
#  secure_public_id         :string
#  user_id                  :bigint
#
# Indexes
#
#  index_applicants_on_account_id        (account_id)
#  index_applicants_on_created_by_id     (created_by_id)
#  index_applicants_on_dynamic_form_id   (dynamic_form_id)
#  index_applicants_on_job_position_id   (job_position_id)
#  index_applicants_on_secure_public_id  (secure_public_id) UNIQUE
#  index_applicants_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (dynamic_form_id => dynamic_forms.id)
#  fk_rails_...  (job_position_id => job_positions.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class ApplicantTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
