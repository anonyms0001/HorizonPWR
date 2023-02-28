class OptionsValidator < ActiveModel::Validator
  def validate(record)
    # NOTE: Standardrb doesn't like `reject...count`, but it is necessary here!
    #       It will not affect performance, since this is looping over a tiny array.
    if record.field_type == "select" && record.options.reject(&:empty?).count == 0
      record.errors.add :options, "[You must include at least 1 option for a select field.]"
    end
  end
end
