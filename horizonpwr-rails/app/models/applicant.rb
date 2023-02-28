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
class Applicant < ApplicationRecord
  has_person_name

  belongs_to :user, optional: true
  belongs_to :dynamic_form, optional: true
  belongs_to :job_position, optional: true
  belongs_to :created_by, class_name: "User", foreign_key: "created_by_id", optional: true
  belongs_to :account, class_name: "Account", foreign_key: "account_id", optional: true
  has_many :notes, as: :notable, dependent: :destroy
  has_many_attached :attachments

  validates :name, :first_name, :last_name, presence: true
  validates :middle_initial, presence: true, if: :middle_initial_required?, on: :create
  validate :email_format
  validates :phone, phone: true, presence: true
  before_save :normalize_phone
  before_save :default_email

  has_secure_token :secure_public_id, length: 40 # https://github.com/rails/rails/blob/main/activerecord/lib/active_record/secure_token.rb

  include PgSearch::Model
  pg_search_scope :search_by_params,
    against: [:id, :email, :first_name, :last_name, :new_email, :phone, :start_date, :status, :created_at, :secure_public_id],
    associated_against: {
      created_by: [:first_name, :last_name, :email, :phone],
      account: [:name],
      user: [:first_name, :last_name, :email, :phone],
      job_position: [:name]
    },
    using: {tsearch: {prefix: true}}

  def normalize_phone
    self.phone = Phonelib.parse(phone).full_e164.presence
  end

  def default_email
    self.new_email ||= User.find_by(email: "#{first_name}.#{last_name}@horizonpwr.com".downcase) && middle_initial? || Applicant.find_by(new_email: "#{first_name}.#{last_name}@horizonpwr.com".downcase) && middle_initial? ? "#{first_name}.#{middle_initial}.#{last_name}@horizonpwr.com".downcase : "#{first_name}.#{last_name}@horizonpwr.com".downcase
  end

  def email_format
    if email.present?
      return if email.to_s&.match?(Devise.email_regexp) # allow if passes devise email validation
      errors.add(:email, "must be a valid email address")
    else
      errors.add(:email, "must provide a valid email address")
    end
  end

  def status_color
    case status
    when "new"
      "indigo"
    when "contacted"
      "green"
    when "interviewed"
      "yellow"
    when "offered"
      "purple"
    when "hired"
      "blue"
    when "rejected"
      "red"
    when "onboarding"
      "blue"
    when "invited"
      "purple"
    end
  end

  def self.status_choices
    [
      "new",
      "contacted",
      "interviewed",
      "offered",
      "hired",
      "invited",
      "onboarding",
      "activated",
      "rejected"
    ]
  end

  def canvass_link
    "https://admin.saleshub.io/employees/edit/#{canvass_user_id}"
  end

  def teams
    Account.select(:id, :name).where(personal: false).where(active: true)
  end

  def middle_initial_required?
    User.find_by(email: default_email)
  end

  # def job_position_name
  #   job_position.present? ? job_position.name : "Job position not assigned"
  # end

  # def self.select_options(job_position = nil)
  #   if job_position
  #     User.joins(:job_position).where("name LIKE ?", "%#{job_position}").where(active: true).order(first_name: :asc)
  #   else
  #     User.where(active: true)
  #   end
  # end
end
