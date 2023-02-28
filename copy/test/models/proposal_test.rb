# == Schema Information
#
# Table name: proposals
#
#  id                           :bigint           not null, primary key
#  blocked                      :boolean          default(FALSE), not null
#  blocked_on                   :string
#  completion_state             :string           default("new"), not null
#  design_completed_at          :datetime
#  design_started_at            :datetime
#  quality_control_completed_at :datetime
#  quality_control_section_step :integer          default(1)
#  quality_control_started_at   :datetime
#  quality_control_step         :integer          default(1)
#  reason_incomplete            :string
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  address_id                   :bigint
#  appointment_id               :bigint
#  design_by_id                 :bigint
#  project_id                   :bigint
#  quality_control_by_id        :bigint
#
# Indexes
#
#  index_proposals_on_address_id             (address_id)
#  index_proposals_on_appointment_id         (appointment_id)
#  index_proposals_on_design_by_id           (design_by_id)
#  index_proposals_on_project_id             (project_id)
#  index_proposals_on_quality_control_by_id  (quality_control_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (appointment_id => appointments.id)
#  fk_rails_...  (design_by_id => users.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (quality_control_by_id => users.id)
#
require "test_helper"

class ProposalTest < ActiveSupport::TestCase
  def setup
    @proposal = proposals(:one)
    @address = addresses(:one)
    @contact = contacts(:one)
  end

  class AddressSearchTest < ProposalTest
    test "address.address" do
      proposals = Proposal.search_by_params(@address.address)

      assert_includes proposals, @proposal
    end

    test "address.address_type" do
      proposals = Proposal.search_by_params(@address.address_type)

      assert_includes proposals, @proposal
    end

    test "address.city" do
      proposals = Proposal.search_by_params(@address.city)

      assert_includes proposals, @proposal
    end

    test "address.number" do
      proposals = Proposal.search_by_params(@address.number)

      assert_includes proposals, @proposal
    end

    test "address.postal_code" do
      proposals = Proposal.search_by_params(@address.postal_code)

      assert_includes proposals, @proposal
    end

    test "address.state" do
      proposals = Proposal.search_by_params(@address.state)

      assert_includes proposals, @proposal
    end

    test "address.street" do
      proposals = Proposal.search_by_params(@address.street)

      assert_includes proposals, @proposal
    end
  end

  class ContactsSearchTest < ProposalTest
    test "contacts.first_name" do
      proposals = Proposal.search_by_params(@contact.first_name)

      assert_includes proposals, @proposal
    end

    test "contacts.last_name" do
      proposals = Proposal.search_by_params(@contact.last_name)

      assert_includes proposals, @proposal
    end

    test "contacts.email" do
      proposals = Proposal.search_by_params(@contact.email)

      assert_includes proposals, @proposal
    end

    test "contacts.phone" do
      proposals = Proposal.search_by_params(@contact.phone)

      assert_includes proposals, @proposal
    end
  end

  class CreatedBySearchTest < ProposalTest
    def setup
      super
      @created_by = users(:one)
    end

    test "created_by.first_name" do
      proposals = Proposal.search_by_params(@created_by.first_name)

      assert_includes proposals, @proposal
    end

    test "created_by.last_name" do
      proposals = Proposal.search_by_params(@created_by.last_name)

      assert_includes proposals, @proposal
    end

    test "created_by.email" do
      proposals = Proposal.search_by_params(@created_by.email)

      assert_includes proposals, @proposal
    end

    test "created_by.phone" do
      proposals = Proposal.search_by_params(@created_by.phone)

      assert_includes proposals, @proposal
    end
  end

  class DesignedBySearchTest < ProposalTest
    def setup
      super
      @designed_by = users(:three)
    end

    test "designed_by.first_name" do
      proposals = Proposal.search_by_params(@designed_by.first_name)

      assert_includes proposals, @proposal
    end

    test "designed_by.last_name" do
      proposals = Proposal.search_by_params(@designed_by.last_name)

      assert_includes proposals, @proposal
    end

    test "designed_by.email" do
      proposals = Proposal.search_by_params(@designed_by.email)

      assert_includes proposals, @proposal
    end

    test "designed_by.phone" do
      proposals = Proposal.search_by_params(@designed_by.phone)

      assert_includes proposals, @proposal
    end
  end

  class QualityControlBySearchTest < ProposalTest
    def setup
      super
      @quality_control_by = users(:four)
    end

    test "quality_control_by.first_name" do
      proposals = Proposal.search_by_params(@quality_control_by.first_name)

      assert_includes proposals, @proposal
    end

    test "quality_control_by.last_name" do
      proposals = Proposal.search_by_params(@quality_control_by.last_name)

      assert_includes proposals, @proposal
    end

    test "quality_control_by.email" do
      proposals = Proposal.search_by_params(@quality_control_by.email)

      assert_includes proposals, @proposal
    end

    test "quality_control_by.phone" do
      proposals = Proposal.search_by_params(@quality_control_by.phone)

      assert_includes proposals, @proposal
    end
  end

  class ScheduledWithSearchTest < ProposalTest
    def setup
      super
      @scheduled_with = users(:two)
    end

    test "scheduled_with.first_name" do
      proposals = Proposal.search_by_params(@scheduled_with.first_name)

      assert_includes proposals, @proposal
    end

    test "scheduled_with.last_name" do
      proposals = Proposal.search_by_params(@scheduled_with.last_name)

      assert_includes proposals, @proposal
    end

    test "scheduled_with.email" do
      proposals = Proposal.search_by_params(@scheduled_with.email)

      assert_includes proposals, @proposal
    end

    test "scheduled_with.phone" do
      proposals = Proposal.search_by_params(@scheduled_with.phone)

      assert_includes proposals, @proposal
    end
  end
end
