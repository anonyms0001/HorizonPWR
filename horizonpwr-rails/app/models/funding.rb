# == Schema Information
#
# Table name: fundings
#
#  id                        :bigint           not null, primary key
#  amount                    :integer
#  application_submitted_at  :datetime
#  approved_at               :datetime
#  coc_sent_at               :datetime
#  coc_signed_at             :datetime
#  denied_at                 :datetime
#  invoice_sent_at           :datetime
#  loan_docs_signed_at       :datetime
#  sent_to_collections_at    :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  finance_partner_id        :bigint           not null
#  project_id                :bigint           not null
#  sent_to_collections_by_id :bigint
#
# Indexes
#
#  index_fundings_on_finance_partner_id         (finance_partner_id)
#  index_fundings_on_project_id                 (project_id)
#  index_fundings_on_sent_to_collections_by_id  (sent_to_collections_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (finance_partner_id => finance_partners.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (sent_to_collections_by_id => users.id)
#
class Funding < ApplicationRecord
  belongs_to :project
  belongs_to :finance_partner
  belongs_to :sent_to_collections_by, class_name: "User", optional: true
  before_save :set_sent_to_collections_by

  has_many :funding_payments, dependent: :destroy

  def self.no_payments
    Funding.where.missing(:funding_payments)
  end

  def self.good_faith
    good_faith_payments = FundingPayment.where(payment_type: "good_faith").map(&:funding_id)
    other_payments = FundingPayment.where(payment_type: ["first_payment", "second_payment"]).map(&:funding_id)
    Funding.includes(:project)
      .where(id: (good_faith_payments - other_payments))
      .where.not(project: {status: "cancelled"})
  end

  def self.first_payment
    first_payments = FundingPayment.where(payment_type: "first_payment").map(&:funding_id)
    second_payments = FundingPayment.where(payment_type: "second_payment").map(&:funding_id)
    Funding.includes(:project)
      .where(id: (first_payments - second_payments))
      .where.not(project: {status: "cancelled"})
  end

  def self.fully_funded
    first_payments = FundingPayment.where(payment_type: "first_payment").map(&:funding_id)
    second_payments = FundingPayment.where(payment_type: "second_payment").map(&:funding_id)
    Funding.includes(:project)
      .where(id: (first_payments & second_payments))
      .where.not(project: {status: "cancelled"})
  end

  def self.cancelled_and_overdue
    Funding.includes(:project, :funding_payments)
      .where(project: {status: "cancelled"})
      .where.not(funding_payments: {payment_type: "cancellation_fee"})
  end

  def self.incomplete_install
    Funding.includes(:project, :funding_payments)
      .where.not(project: {status: ["complete", "cancelled", "pending_cancel", "site_audit_scheduled"]})
    # %w[complete cancelled pending_cancel site_audit_scheduled install_scheduled coc_signed inspection_scheduled pto_requested pto_approved]
  end

  private

  def set_sent_to_collections_by
    self.sent_to_collections_by = current_user if sent_to_collections_at_changed?
  end
end
