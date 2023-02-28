class SalesforceProjectIdValidator < ActiveModel::Validator
  def validate(record)
    # NOTE: Standardrb doesn't like `reject...count`, but it is necessary here!
    #       It will not affect performance, since this is looping over a tiny array.
    if record.salesforce_residential_project_id.present? && record.salesforce_residential_project_id_changed?
      if !record.valid_salesforce_project_id?
        record.errors.add :salesforce_residential_project_id, "Salesforce Project Could not be found."
      end
    end
  end
end
