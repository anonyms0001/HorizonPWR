# == Schema Information
#
# Table name: installers
#
#  id                      :bigint           not null, primary key
#  active                  :boolean
#  name                    :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  salesforce_installer_id :string
#
# Indexes
#
#  index_installers_on_salesforce_installer_id  (salesforce_installer_id)
#
require "test_helper"

class InstallerTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
