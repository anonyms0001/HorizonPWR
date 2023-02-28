# == Schema Information
#
# Table name: field_responses
#
#  id                 :bigint           not null, primary key
#  response           :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  field_config_id    :bigint           not null
#  form_response_id   :bigint           not null
#  last_updated_by_id :bigint
#
# Indexes
#
#  index_field_responses_on_field_config_id     (field_config_id)
#  index_field_responses_on_form_response_id    (form_response_id)
#  index_field_responses_on_last_updated_by_id  (last_updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (field_config_id => field_configs.id)
#  fk_rails_...  (form_response_id => form_responses.id)
#  fk_rails_...  (last_updated_by_id => users.id)
#
class FieldResponse < ApplicationRecord
  RESPONSES = FieldConfig.all.map(&:title).uniq.reject(&:empty?).sort
  before_save :set_last_updated_by
  after_save :trigger_eventable_action

  belongs_to :form_response
  belongs_to :field_config
  belongs_to :user, optional: true
  belongs_to :created_by, class_name: "User", foreign_key: "created_by_id", optional: true
  belongs_to :last_updated_by, class_name: "User", foreign_key: "last_updated_by_id", optional: true

  RESPONSES.each do |response|
    # define_method(:"#{response}_field") { |value| super ActiveRecord::Type::Boolean.new.cast(value) }
    define_method(response.to_sym) {}
  end

  def completed?
    if field_config.field_type == ("check_box")
      response == "1"
    else # text_area, text_field, number_field, select
      !response.blank?
    end
  end

  def self.fields_with_filled_fields(model, field_title)
    field_config_ids = FieldConfig.where("title LIKE ?", "%#{field_title}%").map(&:id)
    where(field_config_id: field_config_ids).where.not(response: [nil, ""])
  end

  private

  def set_last_updated_by
    if should_update_user?
      self.last_updated_by = current_user
    end
  end

  def should_update_user?
    # This method ONLY works if it is called before the object is saved. After the object is saved it will return an unexpected result of true
    !checkbox? && response.present? || checkbox? && response == "1" || persisted? && changed?
  end

  def should_trigger_event?
    !checkbox? && response.present? ||
      checkbox? && response == "1" ||
      previous_changes["response"].present? && !previous_changes["response"][0].nil?
  end

  def checkbox?
    field_config.field_type == "check_box"
  end

  def trigger_eventable_action
    if field_config.eventable_action.present? && should_trigger_event?
      event = current_user.events.new(action: field_config.eventable_action, eventable: self)
      unless event.save!
        Honeybadger.notify("Event could not be created #{field_response.id}.")
      end
      if form_response.respondable_type == "Project"
        project_feed = ProjectFeed.new(project_feedable: event, project_id: event.eventable.form_response.respondable_id)
        unless project_feed.save!
          Honeybadger.notify("ProjectFeed could not be created for Event #{event.id}.")
        end
      end
    end
  end
end
