class AppointmentConsultValidator < ActiveModel::Validator
  def validate(record)
    # NOTE: Standardrb doesn't like `reject...count`, but it is necessary here!
    #       It will not affect performance, since this is looping over a tiny array.
    if !record.consult_id.present? && !record.consult?
      record.errors.add :options, "[Consult missing error]"
    elsif record.consult_id.present? && !record.consult.consult?
      record.errors.add :options, "[Consult Appointment must be a consult]"
    end
  end
end
