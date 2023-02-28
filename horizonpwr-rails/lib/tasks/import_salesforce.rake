namespace :import_salesforce do
  desc "TODO"
  task data: :environment do
    @client = SalesforceClient.new.client

    # users = @client.query("SELECT Id, Team__c, Position__c, Name, CreatedDate, Company_Email__c, Personal_Email__c, Termination_Date__c, Status__c, Start_Date__c, Phone, Reason_Inactive__c, Birthdate__c  FROM Account")
    teams = @accounts.map(&:Team__c).uniq
    # job_positions = @accounts.map(&:Position__c).uniq
    installers = SalesforceClient.new.client.query("SELECT Id, Name FROM Installer__c WHERE LastReferencedDate > 2020-01-01T00:00:00Z AND Name != 'test installer' AND IsDeleted = false")

    # Installers
    print "\nImporting Installers\n"
    installers.each do |installer|
      print "."
      Installer.create(name: installer["Name"], active: true)
    end

    # Create Teams
    teams.each do |team|
      # SF Column Names:
      # Team__c
      unless team.nil?
        create_account(User.first, team)
      end
    end

    # Some projects didn't have an address after importing the from SF. The appointments did, so we made this to fix some. Might need it in the future when importing
    #
    # projects = Project.where(address: nil)
    # projects.each do |project|
    #   appointment = Appointment.find_by(salesforce_residential_project_id: project.salesforce_residential_project_id)
    #   project.address = appointment&.address
    #   project.save
    # end
  end

  desc "TODO"
  task limits: :environment do
    @client = SalesforceClient.new.client
    used = "#{@client.limits["DailyApiRequests"]["Max"] - @client.limits["DailyApiRequests"]["Remaining"]} Used".to_s
    remaining = "#{@client.limits["DailyApiRequests"]["Remaining"]} Remaining".to_s
    max = "#{@client.limits["DailyApiRequests"]["Max"]} Max".to_s
    print "\nSalesforce Limits DailyApiRequests\n#{used}\n#{remaining}\n#{max}\n"
  end

  # File.open("#{Rails.root}/tmp/#{a.Title}", 'wb') { |f| f.write(a.Body) }

  desc "TODO"
  task attachments: :environment do
    @client = SalesforceClient.new.client
    @documents = @client.query("Select Id From Document")
    @attachments = @client.query("SELECT Id, IsDeleted, ParentId, Name, IsPrivate, ContentType, BodyLength, Body, OwnerId, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, Description, IsPartnerShared, ConnectionReceivedId, ConnectionSentId FROM Attachment")
    used = "#{@client.limits["DailyApiRequests"]["Max"] - @client.limits["DailyApiRequests"]["Remaining"]} Used".to_s
    remaining = "#{@client.limits["DailyApiRequests"]["Remaining"]} Remaining".to_s
    max = "#{@client.limits["DailyApiRequests"]["Max"]} Max".to_s
    print "\nSalesforce Limits DailyApiRequests\n#{used}\n#{remaining}\n#{max}\n"

    count = 0
    random_attachments_count = 0
    @random_attachments = []
    user_attachments = 0
    project_attachments = 0

    print "\nDownloading Attachments from Salesforce\n"
    @attachments.each do |a|
      # attachment = @client.query("SELECT Id, IsDeleted, ParentId, Name, IsPrivate, ContentType, BodyLength, Body, OwnerId, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, Description, IsPartnerShared, ConnectionReceivedId, ConnectionSentId FROM Attachment WHERE Id = '#{a['Id']}'").first  #FolderId = '#{folder.Id}'
      File.open("#{Rails.root}/tmp/#{a.Name}", "wb") { |f| f.write(a.Body) }
      print "."
    end

    print "\nUploading Attachments to S3"
    @attachments.each do |attachment|
      begin
        # attachment = @client.query("SELECT Id, IsDeleted, ParentId, Name, IsPrivate, ContentType, BodyLength, Body, OwnerId, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, Description, IsPartnerShared, ConnectionReceivedId, ConnectionSentId FROM Attachment WHERE Id = '#{a['Id']}'").first
        # File.open("#{Rails.root}/tmp/#{attachment.Name}", 'wb') { |f| f.write(attachment.Body) }
        if User.where(salesforce_account_id: attachment["ParentId"]).first.present?
          user_attachments += 1
          user.documents.attach(io: File.open("#{Rails.root}/tmp/#{attachment.Name}", "r+"), filename: attachment["Name"].to_s)
          user.documents.last.update(created_at: attachment["CreatedDate"])
          print "."
        elsif User.where("extra_salesforce_account_ids @> ?", "{'#{attachment["ParentId"]}'}").present?
          user_attachments += 1
          user.documents.attach(io: File.open("#{Rails.root}/tmp/#{attachment.Name}", "r+"), filename: attachment["Name"].to_s)
          user.documents.last.update(created_at: attachment["CreatedDate"])
          print "."
        elsif Project.where(salesforce_residential_project_id: attachment["ParentId"]).first.present?
          project_attachments += 1
          print "-"
          user.documents.attach(io: File.open("#{Rails.root}/tmp/#{attachment.Name}", "r+"), filename: attachment["Name"].to_s)
          user.documents.last.update(created_at: attachment["CreatedDate"])
        else
          random_attachments_count += 1
          print "?"

          @random_attachments << attachment
          User.first.documents.attach(io: File.open("#{Rails.root}/tmp/#{attachment.Name}", "r+"), filename: attachment["Name"].to_s)
          User.first.documents.last.update(created_at: attachment["CreatedDate"])
        end
      rescue
      end
      count += 1
    end
    print "\nImport Complete"
  end
end
