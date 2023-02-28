class AppointmentHeldValidator < ActiveModel::Validator
  def validate(record)
    if record.consult?
      # NOTE: Skip validations if just updating the scheduled_with
      if !(record.scheduled_with_id_changed? && record.changes.size == 1)
        # NOTE: held_reason is not submitted when we run the CanvassAppointmentSyncJob,
        # and we don't want the validations to run when the job does.
        # Even if held_reason is blank, it is still submitted, allowing this to run
        # TODO: this condition bypasses held and held by requirements for anything submitted without a held_reason
        # This only enforces validations internally on our rails forms
        # not in models, or any other actions
        if record.changed.include?("held_reason")
          if record.held.nil? || record.held_by.blank?
            # NOTE: User is expected to never hit this error.
            record.errors.add :held, "and Held By must be provided."
            # NOTE: Always require a reason if Held is submitted.
          elsif record.held_changed? && record.held_reason.blank?
            record.errors.add :held_reason, "must be provided."
          end
        end
      end
    elsif record.held_changed? && !record.changed.include?("held_reason")
      record.errors.add :held, "option should only be available to consult appointments."
    end
  end
end
