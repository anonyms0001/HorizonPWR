class SalesforceClient
  attr_reader :client

  def initialize
    @client = Restforce.new(
      username: Rails.application.credentials.salesforce[:username],
      password: Rails.application.credentials.salesforce[:password],
      client_id: Rails.application.credentials.salesforce[:client_id],
      client_secret: Rails.application.credentials.salesforce[:client_secret],
      api_version: "41.0"
    )
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
    client.query("select name, id, Team__c, status__c, position__c, Start_Date__c, Company_Email__c, Personal_Email__c, Birthdate__c, Shirt_Size__c, Termination_Date__c, Reason_Inactive__c, phone from Account where position__c = '#{position}' AND status__c = '#{employment_status}'")
  end

  def photo_url
    "https://horizonpower.lightning.force.com/#{url}"
  end

  def installers
  end

  def user_create(user)
    if Rails.env == "production" && user.salesforce_account_id.nil? && !user_find(user)
      # Add a new account
      sf_account = client.create!(
        "Account",
        Name: user.name,
        Personal_Email__c: user.personal_email,
        Company_Email__c: user.email,
        Phone: user.phone,
        Birthdate__c: user.birth_date,
        Start_Date__c: user.start_date,
        Status__c: "Onboarding",
        Team__c: user.accounts.impersonal&.first&.name,
        position__c: user.job_position&.name,
        Shirt_Size__c: user.shirt_size,
        Shoe_Size__c: user.shoe_size
      )
      user.update(salesforce_account_id: sf_account)
    end
  end

  def user_update(user)
    if Rails.env == "production"
      unless user.salesforce_account_id.present? || user_find(user)
        return false
      end
      client.update(
        "Account",
        Id: user.salesforce_account_id,
        Name: user.name,
        Personal_Email__c: user.personal_email,
        Company_Email__c: user.email,
        Phone: user.phone,
        Birthdate__c: user.birth_date,
        Start_Date__c: user.start_date,
        Team__c: user.accounts.impersonal&.first&.name,
        position__c: user.job_position&.name,
        Shirt_Size__c: user.shirt_size,
        Shoe_Size__c: user.shoe_size
      )
    end
  end

  def user_find(user)
    return true if user.salesforce_account_id.present?
    sf_work_email = client.query("select name, id, Team__c, status__c, position__c, Start_Date__c, Company_Email__c, Personal_Email__c, Birthdate__c, Shirt_Size__c, Termination_Date__c, Reason_Inactive__c, phone from Account where Company_Email__c = '#{user.email}'")&.first
    return false unless sf_work_email.present?
    account = Account.find_by(name: sf_work_email["Team__c"])
    AccountUser.find_or_create_by(account: account, user: user)
    job_position_id = JobPosition.find_by(name: sf_work_email["Position__c"])&.id

    user.salesforce_account_id ||= sf_work_email["Id"]
    user.start_date ||= sf_work_email["Start_Date__c"]
    user.personal_email ||= sf_work_email["Personal_Email__c"]
    user.job_position_id = job_position_id # This is intentionally off while we are working with sf so we don't accidentally remove updated promotions.
    user.birth_date ||= sf_work_email["Birthdate__c"]
    user.shirt_size ||= sf_work_email["Shirt_Size__c"]
    user.shoe_size ||= sf_work_email["Shoe_Size__c"]
    user.phone ||= sf_work_email["Phone"]
    user.end_date ||= sf_work_email["Termination_Date__c"]
    user.save
  end

  # TODO: Fix this. A boolean should not possibly update the User.
  def user_exists?(user)
    return true if user.salesforce_account_id.present?

    sf_account = client.query("select name, id, Team__c, status__c, position__c, Start_Date__c, Company_Email__c, Personal_Email__c, Birthdate__c, Shirt_Size__c, Termination_Date__c, Reason_Inactive__c, phone from Account where Company_Email__c = '#{user.email}'")
    return false unless sf_account.first.present?

    sf_account_id = sf_account.first["Id"]
    user.update(salesforce_account_id: sf_account_id) if sf_account_id.present?
    sf_account_id.present?
  end

  def sf_projects
    @projects = @client.query("SELECT #{project_attributes.join(", ")} FROM Residential_Projects__c")
  end

  def sf_projects_performance_stats_filter
    @client.query("SELECT #{project_attributes.join(", ")} FROM Residential_Projects__c WHERE Install_Date__c = THIS_YEAR AND Project_Cancelled__c = false")
  end

  def project_attributes
    projects = @client.query("SELECT Id FROM Residential_Projects__c")
    project = find_project(projects.first["Id"])
    project.keys.drop(1)
  end

  def find_project(project_id)
    @client.find("Residential_Projects__c", project_id)
  end

  def generate_csv
    require "csv"
    # attributes = %w{Id Name Street_Address__c City__c State__c Zip__c Permit_Pack_Requested__c Engineering_Submitted__c Interconnection_App_Approved__c Rough_In_Inspection_Passed__c Electrical_Permit_Approved__c Projected_Install_Date_Formula__c Install_Complete_Date_Time__c} #customize columns here
    attributes = project_attributes
    @projects = @client.query("SELECT #{attributes.join(", ")} FROM Residential_Projects__c")

    file = "#{Rails.root}/tmp/projects_data.csv"
    CSV.open(file, "w") do |csv|
      csv << attributes

      @projects.each do |project|
        csv << attributes.map { |attr| project.send(attr) }
      end
    end
  end

  def update_installer_stats
    PerformanceStat.update_installer_stats(sf_projects_performance_stats_filter)
  end

  def find_or_create_installer(sf_project)
    installer = Installer.find_or_create_by(salesforce_installer_id: sf_project["Installer__c"])
    return installer if installer.persisted?
    sync_installers
    find_or_create_installer(sf_project)
  end

  def sync_installers
    puts 'Syncing Installers'
    sf_installers = @client.query("SELECT Id, name FROM installer__c")
    sf_installers.each do |sf_installer|
      installer = Installer.find_or_initialize_by(salesforce_installer_id: sf_installer["Id"])
      installer.name = sf_installer['Name']
      installer.active = true
      installer.save!
    end
    puts 'Syncing Installers Complete'
  end
  # Find opportunities from contacts with a canvass_contact_id
  # Save on contact
  #
  # Find projects from opportunities
  # save RP__c.id on projects
  #
  #
  # Make a grow chart showing which SF projects are missing from pwrstation
  # Know which projects on pwrstation are not on SF
  # Know which projects on SF are not on Pwrstation
  #
  # "Field_Marketer_Team_Name__c"=>"Medford"
  #

  def find_opportunity(canvass_contact_id)
    attributes = table_attributes(sf_table_name("opportunity"))
    @client.query("SELECT #{attributes.join(", ")} FROM Opportunity where Canvass_ID__c = '#{canvass_contact_id}'")
  end

  def find_opportunities
    attributes = table_attributes(sf_table_name("opportunity"))
    # @client.query("SELECT #{attributes.join(", ")} FROM Opportunity WHERE Canvass_ID__c != '#{nil}' AND CreatedDate = THIS_YEAR")
    @client.query("SELECT #{attributes.join(", ")} FROM Opportunity WHERE Canvass_ID__c != 'nil'")
  end

  def sync_contact(contact)
    opportunity = find_opportunity(contact.canvass_contact_id)
    contact.update(salesforce_opportunity_id: opportunity.first["Id"]) if opportunity.present?
  end

  def find_projects
    attributes = table_attributes(sf_table_name("project"))
    # @client.query("SELECT #{attributes.join(", ")} FROM Residential_Projects__c WHERE Opportunity__c != '#{nil}' AND CreatedDate = THIS_YEAR")
    @client.query("SELECT #{attributes.join(", ")} FROM Residential_Projects__c WHERE Opportunity__c != 'nil'")
  end

  def sync_residental_projects_to_projects
    sf_projects = find_projects
    projects = []
    count = 0
    sf_projects.each do |sf_project|
      contact = Contact.find_by(salesforce_opportunity_id: sf_project["Opportunity__c"])
      if contact.present?
        count += 1
        contact.addresses.each do |address|
          address.projects.each do |project|
            project.update_columns(salesforce_opportunity_id: sf_project["Opportunity__c"], salesforce_residential_project_id: sf_project["Id"])
            # TODO: verify that sf_project has the same ec and account_id for the pwrstation project, if not, update the pwrstation one using
            # project.change_account_and_sold_by(account, sold_by)
            # TODO:
            # SalesforceClient.new.sync_opportunites_to_pwrstation
            # projects = SalesforceClient.new.sync_residental_projects_to_projects
          end
        end
      end
    end
    projects.flatten!
    puts "synced #{projects.size} projects with SF"
    projects
  end

  # projects = []
  # contacts.each do |contact|
  #   contact.addresses.each do |address|
  #     projects << address.projects
  #   end
  # end
  # project = contact.addresses&.first&.projects&.first

  def sync_opportunites_to_pwrstation
    # opportunities = SalesforceClient.new.find_opportunities
    # sf_projects = SalesforceClient.new.find_projects
    # SalesforceClient.new.sync_opportunites_to_pwrstation
    # projects = SalesforceClient.new.sync_residental_projects_to_projects
    # sf_projects.map(&['Opportunity__c'])
    count = 0
    find_opportunities.each do |opportunity|
      contact = Contact.find_by(canvass_contact_id: opportunity["Canvass_ID__c"])
      if contact.present?
        contact.update(salesforce_opportunity_id: opportunity["Id"])
        count += 1
      end
    end
    puts "synced #{count} contacts with SF"
  end

  def sync_contacts
    # 6723
    contacts = Contact.where(salesforce_opportunity_id: nil).where.not(canvass_contact_id: nil)
    contacts.each do |contact|
      sync_contact(contact)
    end
  end

  # opportunity = SalesforceClient.new.find_opportunity(contact.canvass_contact_id)
  # contact.update(salesforce_opportunity_id: opportunity.first['Id']) if opportunity.present?
  # opportunity = SalesforceClient.new.find_opportunity(nil)
  #
  # Clearly identify which projects exist in both systems
  #

  def generate_backup_csv(sf_table)
    require "csv"

    timestamp = DateTime.now.strftime("%Y-%m-%d-%H-%M-%S")
    attributes = table_attributes(sf_table_name(sf_table))
    collection = collection(sf_table, attributes)
    file_name = "#{sf_table}_data_#{timestamp}.csv"
    file_path = "#{Rails.root}/tmp/#{file_name}"
    CSV.open(file_path, "w") do |csv|
      csv << attributes
      collection.each do |project|
        csv << attributes.map { |attr| project.send(attr) }
      end
    end
    upload_backup(file_path, file_name)
  end

  def upload_backup(file_path, file_name)
    User.first.documents.attach(io: File.open(file_path), filename: file_name)
  end

  def table_attributes(table)
    collection = @client.query("SELECT Id FROM #{table}")
    instance = @client.find(table, collection.first["Id"])
    instance.keys.drop(1)
  end

  def sf_table_name(sf_table)
    case sf_table.downcase
    when "account"
      "Account"
    when "lead"
      "Lead"
    when "opportunity"
      "Opportunity"
    when "project"
      "Residential_Projects__c"
    end
  end

  def collection(sf_table, attributes)
    @client.query("SELECT #{attributes.join(", ")} FROM #{sf_table_name(sf_table)}")
  end

  private

  # Queries
  #   @client.query("select name from Contact")
  # client.query(“SELECT Id, Name FROM Installer__c WHERE LastReferencedDate > 2020-01-01T00:00:00Z AND Name != ‘test installer’ AND IsDeleted = false”)
end
