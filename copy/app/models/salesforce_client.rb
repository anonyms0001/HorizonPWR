class SalesforceClient
  attr_reader :client

  def initialize
    @client = Restforce.new(username: Rails.application.credentials.salesforce[:username],
                            password: Rails.application.credentials.salesforce[:password],
                            client_id: Rails.application.credentials.salesforce[:client_id],
                            client_secret: Rails.application.credentials.salesforce[:client_secret],
                            api_version: "41.0")
  end

  def teams(active = true)
    status = active ? "Active" : "Inactive"
    teams = @client.query("select name, Team__c, status__c, position__c, Start_Date__c, Company_Email__c, Personal_Email__c, Birthdate__c, Shirt_Size__c, Termination_Date__c, Reason_Inactive__c, phone from Account where status__c = '#{status}'")
    teams.map(&:Team__c).uniq
  end

  def field_marketers
    employees("Field Marketer")
  end

  def energy_consultants
    employees("Energy Consultant")
  end

  def employees(position, active = true)
    employment_status = active ? "Active" : "Inactive"
    client.query("select name, Team__c, status__c, position__c, Start_Date__c, Company_Email__c, Personal_Email__c, Birthdate__c, Shirt_Size__c, Termination_Date__c, Reason_Inactive__c, phone from Account where position__c = '#{position}' AND status__c = '#{employment_status}'")
  end

  def photo_url
    "https://horizonpower.lightning.force.com/#{url}"
  end

  def installers
  end

  private

  # Queries
  #   @client.query("select name from Contact")
  # client.query(“SELECT Id, Name FROM Installer__c WHERE LastReferencedDate > 2020-01-01T00:00:00Z AND Name != ‘test installer’ AND IsDeleted = false”)
end
