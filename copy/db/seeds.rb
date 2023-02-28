# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
# Uncomment the following to create an Admin user for Production in Jumpstart Pro
# require "faker"

# user1 = User.create name: "Willard Moore", email: "willard.moore@horizonpwr.com", password: "123123", password_confirmation: "123123", admin: true, active: true, terms_of_service: true
# user2 = User.create name: "Ben Sanchez", email: "ben.sanchez@horizonpwr.com", password: "123123", password_confirmation: "123123", admin: true, active: true, terms_of_service: true
# user3 = User.create name: "Alyssa Jimenez", email: "alyssa.jimenez@horizonpwr.com", password: "123123", password_confirmation: "123123", admin: true, terms_of_service: true
# user4 = User.create name: "Rob", email: "rob@horizonpwr.com", password: "123123", password_confirmation: "123123", admin: true, terms_of_service: true
user1 = User.create name: "Developers", email: "webdev@horizonpwr.com", password: "123123", password_confirmation: "123123", admin: true, terms_of_service: true

def create_account(user, name, active = true)
  @account = Account.new(owner_id: user.id, name: name, personal: false, active: active)
  @account.account_users.new(user: user, admin: true)
  @account.save
end

# def create_team_member(position, name = Faker::TvShows::Simpsons.character, active = true)
#   user = User.create position: position, name: name, email: Faker::Internet.email, password: "123123", password_confirmation: "123123", active: true, terms_of_service: true
#   @account = Account.impersonal.where(active: true).sample(1).first
#   @account.account_users.new(user: user, member: true)
#   @account.save
# end

def position
  [
    "Field Marketer",
    "Jr Energy Consultant"
  ]
end

# create_account(user1, "Rexburg")
# create_account(user2, "Clamath Falls")
# create_account(user3, "Bend")
# create_account(user4, "Pocatello")
#

# print "Seeding Users\n"
# 50.times do |x|
# print "."
# create_team_member(position.sample(1).first)
# end

@client = SalesforceClient.new.client
used = "#{@client.limits["DailyApiRequests"]["Max"] - @client.limits["DailyApiRequests"]["Remaining"]} Used".to_s
remaining = "#{@client.limits["DailyApiRequests"]["Remaining"]} Remaining".to_s
max = "#{@client.limits["DailyApiRequests"]["Max"]} Max".to_s
print "\nSalesforce Limits DailyApiRequests\n#{used}\n#{remaining}\n#{max}\n"

@accounts = @client.query("SELECT Id, Team__c, Position__c, Name, CreatedDate, Company_Email__c, Personal_Email__c, Termination_Date__c, Status__c, Start_Date__c, Phone, Reason_Inactive__c, Birthdate__c  FROM Account")
# @accounts = @client.query("SELECT Id, Team__c, Position__c, Name, CreatedDate, Company_Email__c, Personal_Email__c, Termination_Date__c, Status__c, Start_Date__c, Phone, Reason_Inactive__c, Birthdate__c  FROM Account WHERE Company_Email__c = 'mtthwbaer@gmail.com'")
@documents = @client.query("Select Id From Document")
# @documents = @client.query("Select Id From Document")
teams = @accounts.map(&:Team__c).uniq
job_positions = @accounts.map(&:Position__c).uniq
users = @accounts
@attachments = @client.query("SELECT Id, IsDeleted, ParentId, Name, IsPrivate, ContentType, BodyLength, Body, OwnerId, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, Description, IsPartnerShared, ConnectionReceivedId, ConnectionSentId FROM Attachment")

#
# @projects = @client.query('SELECT Id, Team__c, Position__c, Name, CreatedDate, Company_Email__c, Personal_Email__c, Termination_Date__c, Status__c, Start_Date__c, Phone, Reason_Inactive__c, Birthdate__c  FROM Account')
# @client.query('SELECT Id From Residential_Project__c')

installers = @client.query("SELECT Id, Name, IsDeleted, LastReferencedDate FROM Installer__c")
print "\nSeeding Installers\n"
installers.each do |installer|
  active = true
  if installer["IsDeleted"] == true || installer["Name"] == "test installer" || installer["LastReferencedDate"].present? && installer["LastReferencedDate"] > "2020-01-01T00:00:00Z"
    active = false
  end
  salesforce_installer_id = installer["Id"]
  print "."
  Installer.create(name: installer["Name"], salesforce_installer_id: salesforce_installer_id, active: active)
end

teams.each do |team|
  # SF Column Names:
  # Team__c
  unless team.nil?
    create_account(User.first, team)
  end
end

job_positions.each do |job_position|
  # SF Column Names:
  # Position__c
  unless job_position.nil?
    JobPosition.create(name: job_position, active: true)
  end
end

x = 0
print "\nSeeding Users\n"
users.each do |user|
  # SF Column Names:
  # Name, CreatedDate, Company_Email__c, Personal_Email__c, Termination_Date__c, Status__c, Start_Date__c, Phone, Reason_Inactive__c, Birthdate__c

  salesforce_account_id = user["Id"]
  name = user["Name"]
  phone = user["Phone"]
  personal_email = user["Personal_Email__c"]
  email = user["Company_Email__c"] || personal_email || "no_email_#{x}@horizonpwr.com"
  created_at = user["CreatedDate"]
  start_date = user["Start_Date__c"]
  birth_date = user["Birthdate__c"]
  end_date = user["Termination_Date__c"]
  active = user["Status__c"] == "Active"
  admin = false

  # next if email == 'mtthwbaer@gmail.com'
  # next if email == 'jacob.jones@horizonpwr.com'
  # next if email == 'jordan.chambliss@horizonpwr.com'
  # next if email == 'brandontibbitts@gmail.com'
  # next if email == 'dbawtry@yahoo.com'
  # next if email == 'moseshaws94@gmail.com'
  # next if email == 'cayden.larsen@horizonpwr.com'
  # next if email == 'nathan.johnson@horizonpwr.com'
  # next if email == 'jeremy.hall@horizonpwr.com'
  # next if email == 'juddferguson@gmail.com'

  # reason_inactive = user["Reason_Inactive__c"]

  job_position = JobPosition.where(name: user["Position__c"]).first

  print "."
  # I think we need a migration to add id for job position to user. We also need end_reason
  attributes = {
    name: name,
    personal_email: personal_email,
    email: email,
    password: "123123",
    password_confirmation: "123123",
    admin: admin,
    terms_of_service: true,
    created_at: created_at,
    active: active,
    phone: phone,
    birth_date: birth_date,
    end_date: end_date,
    start_date: start_date,
    job_position_id: job_position&.id,
    salesforce_account_id: salesforce_account_id
  }
  user1 = User.find_by(email: email) || User.create(attributes)

  if user["Id"] != user1.salesforce_account_id
    user1.extra_salesforce_account_ids << user["Id"]
    user1.save
    print "-"
    # print "#{user['Id']}\n"
    # print "#{user1.extra_salesforce_account_ids}"
  end

  team = Account.where(name: user["Team__c"]).first
  # unless team.nil?
  team&.account_users&.create(user_id: user1.id, roles: {"member" => true})
  # end

  x += 1
end

# Projects
print "\nSeeding Projects\n"
# @projects = @client.query("SELECT Id, OwnerId, IsDeleted, Name, RecordTypeId, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, LastActivityDate, LastViewedDate, LastReferencedDate, ConnectionReceivedId, ConnectionSentId, Opportunity__c, Site_Auditor_Lookup__c, Installer_Email__c, Account__c, Street_Address__c, City__c, State__c, Zip__c, Email_Address__c, Home_Phone__c, Mobile_Phone__c, Property_Type__c, Power_Company__c, Utility_Account_Number__c, Meter_Number__c, HOA_Name__c, Preliminary_System_Size__c, Panel_Model__c, Customer_Approved_Design__c, Panel_Qty__c, Inverter_Model__c, Inverter_Size_kW__c, Inverter_Qty__c, Install_Status__c, Customer_Number__c, Age__c, On_Hold__c, On_Hold_Date__c, On_Holdlist__c, Project_Cancelled__c, Project_Cancelled_Date__c, Site_Audit_Date__c, Site_Audit_Scheduled__c, Site_Audit_Complete__c, Site_Audit_Time__c, Final_Design_Uploaded__c, Engineering_Complete__c, Engineering_Complete_Date__c, Permit_Submitted__c, Permit_Approved__c, Completion_Certificate_Sent__c, Install_Scheduled__c, Install_Start_Date__c, Install_Complete__c, Completion_Certificate_Sent_Date_Time__c, Inspection_Scheduled__c, Completion_Certificate_Signed__c, Received_from_Structural_Engineer__c, Inspection_Passed__c, Completion_Certificate_Signed_Date_Time__c, Customer_Reassigned__c, Inspection_Date__c, Inspection_Failed__c, Completion_Photos_Uploaded__c, Customer_Reassigned_Date__c, Interconnection_App_Submitted__c, Completion_Photos_Uploaded_Date_Time__c, Old_Energy_Consultant_Name__c, Installation_Agreement_Uploaded__c, Installation_Agreement_Upload_Date_Time__c, System_Active__c, Project_Complete__c, Project_Complete_Date__c, On_Hold_Reason__c, Close_Date_1__c, Close_Date__c, Monitoring_Setup_Complete__c, Perfect_Packet_Date__c, Monitoring_Setup_Complete_Date_Time__c, Substantial_Completion_with_Financier__c, ICX_Submitted_Date__c, ICX_Approved__c, Financier_Substantial_Completion_Date_Ti__c, FormulaToUpdateStage__c, Quote_Type__c, Loan_Amount__c, Dealer_Fee__c, Finance_Partner__c, Panel_Size__c, Amount__c, Ground_Mount__c, Stage_2__c, Recieved_PE_Stamp__c, Received_PE_Stamp_Date__c, PTO_Approved__c, PTO_Submitted__c, Work_Order_Received__c, Work_Order_Received_Date_Time__c, Install_Started__c, HOA_Application_Approved__c, HOA_Application_Submitted__c, Install_Day_Call_Complete__c, True_Up__c, Requested_Contractor_Quote__c, Quote_Requested_Date_Time__c, Design_Sent_To_Rep__c, Sent_PE_Stamp__c, Quote_Requested_From__c, Reassigned_Reason__c, Quote_Notes__c, Received_Quote__c, Docs_Uploaded__c, Docs_Uploaded_Date__c, Received_Quote_Date_Time__c, Interconnection_App_Approved__c, Cancellation_Notes__c, HOA_Inspection_Scheduled__c, HOA_Inspection_Date__c, HOA_Inspection_Passed__c, Cancellation_Request__c, Site_Audit_Notice_Sent__c, Cancellation_Request_Date_Time__c, Contract_Signed__c, Contract_Signed_Date__c, Install_Date__c, Received_from_Structural_Engineer_Date__c, Dealer_Fee_Formula__c, Price_Per_Watt__c, Final_Design_Sent_for_Writing__c, True_Up_Date__c, OnHOldreason__c, Canceled_Reason__c, Energy_Consultant_Email__c, Old_Energy_Consultant_Email__c, Field_Marketer__c, Total_Revenue__c, Old_Install_Status__c, Baseline_Cost__c, Annual_Usage__c, Install_Time__c, Cancellation_Request_Reason__c, Engineer_Stamp_Received__c, Interconnection_Program__c, InstallerOLD__c, Interconnection_Docs_Complete__c, Installer_Notes__c, Referral__c, Site_Audit_Date_Time__c, Site_Audit_Complete_Date_Time__c, Site_Audit_Notice_Sent_Date_Time__c, Final_Design_Sent_for_Writing_Date_Time__c, Final_Design_Uploaded_Date_Time__c, Design_Sent_to_Rep_Date_Time__c, Customer_Approved_Design_Date_Time__c, Engineer_Stamp_Received_Date_Time__c, Interconnection_Docs_Complete_Date_Time__c, Interconnection_App_Submitted_Date_Time__c, Interconnection_App_Approved_Date_Time__c, HOA_Application_Submitted_Date_Time__c, HOA_Application_Approved_Date_Time__c, Permit_Submitted_Date_Time__c, Permit_Approved_Date_Time__c, Install_Scheduled_Date_Time__c, Install_Day_Call_Complete_Date_Time__c, Install_Complete_Date_Time__c, Inspection_Scheduled_Date_Time__c, Inspection_Passed_Date_Time__c, Inspection_Failed_Date_Time__c, HOA_Inspection_Scheduled_Date_Time__c, HOA_Inspection_Passed_Date_Time__c, PTO_Submitted_Date_Time__c, PTO_Approved_Date_Time__c, Wifi_Inverter_Connected__c, Wifi_Inverter_Connected_Date_Time__c, Set_Up_Customers_Production_Watch__c, Set_Up_Customers_Production_Watch_Date_T__c, Follow_Up_Call_Complete__c, Follow_Up_Call_Complete_Date_Time__c, Energy_Consultant_Email1__c, Cancellation_Issue_Resolved__c, DesignerOLD__c, Inspection_Time__c, Install_Status_Formula__c, Electrical_Inspection_Scheduled__c, Electrical_Inspection_Scheduled_DateTime__c, Site_Audit_Photos_Uploaded__c, Site_Audit_Photos_Uploaded_Date_Time__c, Engineering_Submitted__c, Engineering_Submitted_Date__c, Customer_Approved_Interconnection_App__c, Cust_Approved_Interconnection_Date_Time__c, Electrical_Inspection_Passed__c, Final_Design_Complete__c, Final_Design_Complete_Date_Time__c, Electrical_Inspection_Failed__c, Electrical_Inspection_Failed_DateTime__c, Docs_Sent_to_Install_Partner__c, Docs_Sent_to_Install_Partner_Date_Time__c, Electrical_Inspection_Passed_DateTime__c, Completion_Docs_Uploaded__c, Completion_Docs_Uploaded_Date_Time__c, Structural_Engineer__c, Reimbursement_Request__c, Loan_Payment_Due_Date__c, Parent_Override_Paid__c, Requested_Reimbursement_Amount__c, Reimbursement_Complete__c, Parent_Override_Paid_Date__c, Actual_Reimbursement_Amount__c, Reimbursement_Reason__c, Work_Order_Cost__c, True_Up_Cost__c, Substantial_Completion_Cost__c, Outstanding_Financing_Stipulations__c, TextOutstanding_Financing_Stipulations__c, Financier_Stipulations_Cleared1__c, FinancierStipulationsClearedDateme1__c, Dayssitesuditcomplete__c, of_Days_Design_Complete__c, of_Days_Permit_Submitted__c, of_Days_Ready_to_Install__c, of_Days_Install_Scheduled__c, of_days_Install_Complete__c, of_Days_Inspection_Scheduled__c, of_Days_Inspection_Passed__c, of_Days_PTO__c, of_Days_Project_Complete__c, Projected_of_Days_to_Install_Date__c, Projected_Install_Date_Formula__c, Outstanding_Financial_Stipulation_1__c, Work_Order_Install_Date_Time__c, Financial_Stipulation_1_Cleared_Date__c, Outstanding_Financial_Stipulation_2__c, All_Financier_Stipulations_ClearedNEW__c, Financial_Stipulation_2_Cleared_Date__c, Financial_Stipulation_1_Deta__c, Financial_Stipulation_2_Details__c, Outstanding_Financial_Stipulation_3__c, Financial_Stipulation_3_Details__c, Financial_Stipulation_3_Cleared_Date__c, All_Financier_Stipulations_Cleared__c, Reimbursement_Request_Date__c, Reimbursement_Complete_Date__c, Designer__c, Final_System_Size__c, X1st_Funding_Received_Date2__c, X2nd_Funding_Received_Date2__c, Site_Audit_Amount__c, Non_GCU_Cash_Commission__c, GCU_Cash_Commission__c, Non_GCU_Cash_Commission_Paid__c, Non_GCU_Cash_Commission_Paid_Date__c, EC_Commission_Paid__c, EC_Commission_Paid_Date__c, Dividend_Installer_Price__c, QC_System_Size_Financials__c, Override_Amount__c, Parent_Override__c, Parent_Account__c, Close_Taken_By__c, Welcome_Call_Complete__c, Welcome_Call_Complete_Date_Time__c, QC_Complete__c, QC_Completed_By__c, QC_Date_Time__c, Sharin_Pix_Token__c, Financial_Stipulations_Pending__c, Install_Scheduled_for_Today__c, Formula_to_Update_NonHorizon_Assigned_to__c, Solar_Company__c, Non_Horizon_Energy_Consultant__c, Energy_Consultant_Phone__c, HOA_Email__c, Loan_Docs_Signed__c, Pending_Cancellation__c, QC_System_Size_Financials_Date_Time__c, QC_performed_by__c, Final_Design_QC_Complete__c, Final_Design_QC_Complete_Date__c, Pending_Cancellation_Date__c, System_Size__c, Substantial_Completion_Submitted__c, Substantial_Completion_Submit_Date_Time__c, PTO_Confirmed_with_Dividend__c, PTO_Confirmed_with_Dividend_Date_Time__c, Final_Design_Date__c, Spotio_Status__c, Customer_Added_to_Installer_Portal__c, Spotio_Pin__c, Customer_Confirmed_Install_Date__c, Customer_Confirmed_Install_Date_on__c, Customer_Added_to_Installer_Portal_Date__c, QC_Close_Due__c, Add_Customer_to_Installer_Portal_Due__c, Design_Request_Due__c, Send_Design_to_Rep_Due__c, Final_Design_QC_Due__c, Fill_Out_System_Info_Due_Date__c, Schedule_Install_Due__c, Substantial_Completion_Due__c, Docs_Sent_to_Installer_Due__c, Saved__c, Permit_Pack_Complete__c, Permit_Pack_Complete_Date_Time__c, Design_QC_Date_Time__c, Site_Audit_Due__c, Install_Complete_Due__c, Due__c, Sign_Off_on_Final_Design_Due__c, Saved_Date__c, Financial_Stipulation_1_Cleared__c, Financial_Stipulation_2_Cleared__c, Financial_Stipulation_3_Cleared__c, Origination_Fee__c, Energy_Efficiency_Pack__c, Manager_2_Override__c, Manager_3_Override__c, Manager_2_Override_Paid__c, Manager_3_Override_Paid__c, Manager_2_Override_Paid_Date__c, Manager_3_Override_Paid_Date__c, Energy_Efficiency_Package_Delivered__c, HVAC_Cost__c, New_Roof__c, HVAC_Project__c, Service_Type_Requested__c, Service_Quote_Requested__c, Service_Quote_Received__c, Auxiliary_Service_Completed__c, Auxiliary_Service_Scheduled_Date__c, Service_Quote_Requested_Date_Time__c, Auxiliary_Service_Completed_Date_Time__c, Service_Quote_Received_Date_Time__c, Auxiliary_Service_Scheduled__c, Auxiliary_Service_Scheduled_Date_Time__c, Auxiliary_Service_Amount__c, Loan_Docs_Submitted__c, Generations_Approved__c, Saved_Notes__c, Application_Docs_Submitted__c, Generations_Denied__c, Application_Docs_Submitted_Date_Time__c, Loan_Approved_Date_Time__c, Loan_Denied_Date_Time__c, Loan_Docs_Signed_Date_Time__c, Awaiting_Loan_Doc_Signature__c, Awaiting_Generations_Approval__c, Energy_Efficiency_Package_Sent__c, EEP_Sent_Date__c, EEP_Delivered_Date__c, Energy_Efficiency_Pack_Delivered_Date__c, Need_EEP_Sent__c, EEP_Sent__c, Need_EEP_Delivered__c, Gift_Card_Requested__c, Gift_Card_Requested_Date_Time__c, Gift_Card_Sent__c, Gift_Card_Sent_Date_Time__c, Gift_Card_Received__c, Gift_Card_Received_Date_Time__c, Customer_Survey_Sent__c, Customer_Survey_Sent_Date_Time__c, Customer_Survey_Complete__c, Customer_Survey_Complete_Date_Time__c, Need_to_Send_Customer_Survey__c, EEP_Notes__c, Aux_Service_Payment_Received__c, Aux_Service_Payment_Received_Date__c, X1st_Installer_Payment_Sent__c, X1st_Funding_Payment_Received_Date__c, X2nd_Installer_Payment_Sent__c, X2nd_Funding_Payment_Received_Date__c, Power_Guarantee_Date__c, of_days_Site_Audit_Scheduled__c, Adder_Amount__c, Contractor__c, X1st_Installer_Payment_Sent_Date__c, X2nd_Installer_Payment_Sent_Date__c, X1st_Installer_Payment_Amount__c, X2nd_Installer_Payment_Amount__c, Manager_3__c, Manager_2__c, Commission_Deductions__c, X1st_Funding_Payment_Received__c, X2nd_Funding_Payment_Received__c, Concession_Amount__c, Rep_Concession_Amount__c, Funding_Updates__c, Signing_Updates__c, Installer__c, X1st_Funding_Payment_Amount__c, X2nd_Funding_Payment_Amount__c, X1st_Funding_Payment_List__c, Expected_Pay_Date__c, EC_Commission__c, GCU_Cash_Amount__c, Non_GCU_Cash_Amount__c, Parent_Account_Override_Amount__c, Manager_2_Override_Amount__c, Manager_3_Override_Amount__c, Concession_Payment_Sent__c, Concession_Payment_Sent_Date__c, Site_Audit_Info_Needed__c, of_days_since_Final_Design__c, SA_Stalled_Notes__c, FD_Stalled_Notes__c, COC_sent_to_GCU__c, Pending_Cancellation_Formula__c, COC_sent_to_GCU_Date__c, List_Add_Customer_to_Installer_Portal__c, PTO_Reimbursement_Needed__c, PTO_Reimbursement_Sent__c, PTO_Reimbursement_Amount__c, Field_Marketer1__c, Field_Marketer_Team__c, Commission_PPW__c, FM_Cost__c, Battery_Back_Up_Type__c, FM_Position__c, FM_Assist_Commission__c, Baseline_Cost_Per_Watt__c, Build_Cost_Per_Watt__c, Material_Cost__c, Equipment_Cost_Per_Watt__c, Gross_Revenue_Per_Watt__c, Material_Invoice_Paid__c, X1st_Installer_Payment_Date__c, Material_Invoice_Paid_Date_Time__c, EC_Team__c, of_Days_Pending_Cancellation__c, Service_Call__c, Owner__c, Finance_Failed__c, Install_Complete_No_PTO__c, Upgrade_Needed__c, Cancelation_Invoice_Sent__c, Cancelation_Invoice_Paid__c, Cancelation_Invoice_Sent_Date_Time__c, Cancelation_Invoice_Paid_Date_Time__c, Manager_4__c, Manager_4_Override_Amount__c, Manager_4_Override__c, Manager_4_Paid__c, Manager_4_Paid_Date__c, Install_of_Days__c, Finance_Approved_QC__c, Permit_Submitted_QC__c, Permit_Approved_QC__c, Upgrade_Needed_QC__c, GCU_COC_Signed__c, Sunlight_Approved__c, Sunlight_Denied__c, Loanpal_Approved__c, Loanpal_Denied__c, Awaiting_Sunlight_Approval__c, Awaiting_Loanpal_Approval__c, Failed_Engineering__c, three_days__c, Generations_Approved_Date__c, Generations_Denied_Date__c, LoanPal_Approved_Date__c, LoanPal_Denied_Date__c, Sunlight_Approved_Date__c, Sunlight_Denied_Date__c, Permit_Pack_Requested__c, Permit_Pack_Requested_Date__c, Cancelation_Fee__c, Install_Date_Prior_Value__c, Install_Rescheduled_Reason__c, of_Days_from_Close__c, Loan_Doc_Signing_Date__c, Loan_Doc_Expiry_Date__c, Loan_Docs_in_Signing_Que__c, X1st_Invoice_Sent_to_GCU__c, X1st_Invoice_Sent_to_GCU_Date__c, Stip_1__c, Stip_2__c, Stip_3__c, Stip_4__c, Stip_5__c, Outstanding_Financial_Stipulation_4__c, Outstanding_Financial_Stipulation_5__c, Days_until_Install__c, X1st_Commission_Amount__c, X2nd_Commission_Amount__c, X2nd_Commission_Due_Date__c, X1st_Commission_Due_Date__c, X1st_Commission_Paid__c, X1st_Commission_Paid_Date__c, X2nd_Commission_Paid__c, X2nd_Commission_Paid_Date__c, Hours_Install_Scheduled_Permit_Submit__c, Hours_Permit_Submitted_to_Approved__c, Hours_Permit_Submitted_Interconnection__c, Hours_Interconnection_Submitted_Approved__c, Hours_Install_Complete_Inspection_Sched__c, Hours_Inspection_Passed_PTO_Approved__c FROM Residential_Projects__c")
@projects = @client.query('SELECT Id,
 Site_Audit_Date__c,
 Opportunity__c,
 Site_Audit_Notice_Sent_Date_Time__c,
 Install_Scheduled_Date_Time__c,
 CreatedDate,
 Install_Date__c,
 Install_Scheduled__c,
 Installer__c,
 Project_Cancelled__c,
 Pending_Cancellation__c,
 Canceled_Reason__c,
 Cancellation_Request_Reason__c,
 Install_Rescheduled_Reason__c,
 Reimbursement_Reason__c,
 On_Hold_Reason__c,
 OnHOldreason__c,
 Install_Status_Formula__c,
 Install_Complete__c
  FROM Residential_Projects__c')
@projects.each do |salesforce_project|
  # binding.pry
  installer_id = Installer.where(salesforce_installer_id: salesforce_project["Installer__c"]).first&.id
  Project.create(
    salesforce_residential_project_id: salesforce_project["Id"],
    salesforce_opportunity_id: salesforce_project["Opportunity__c"],
    installer_id: installer_id,
    created_at: salesforce_project["CreatedDate"]
  )
  print "."
end

# End of Projects

@accounts = Account.impersonal

@accounts.each do |account|
  unless account.users.map(&:active).uniq.include?(true)
    account.update(active: false)
  end
end

# @message.images.attach(params[:images])
# @message.image.attach(io: File.open('/path/to/file'), filename: 'file.pdf')
# user.documents.attach(io: File.open(attachment.Name), filename: attachment['Name'])
# File.open(attachment.Name, 'wb') { |f| f.write(attachment.Body) }
# documents = client.query('select Id, Name, Body from Document')
@attachments = @client.query("SELECT Id, IsDeleted, ParentId, Name, IsPrivate, ContentType, BodyLength, Body, OwnerId, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, Description, IsPartnerShared, ConnectionReceivedId, ConnectionSentId FROM Attachment")

# @attachments.each do |a|
#   attachment = @client.query("SELECT Id, IsDeleted, ParentId, Name, IsPrivate, ContentType, BodyLength, Body, OwnerId, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, Description, IsPartnerShared, ConnectionReceivedId, ConnectionSentId FROM Attachment WHERE Id = '#{a['Id']}'").first  #FolderId = '#{folder.Id}'
#   File.open("#{Rails.root}/tmp/#{a.Name}", 'wb') { |f| f.write(a.Body) }
#   print '.'
# end

# random_attachments_count = 0
@random_attachments = []
# user_attachments = 0
# project_attachments = 0

# count = 0
print "\nSeeding Attachments\n"
# @attachments.each do |a|
#   begin
#   # attachment = @client.query("SELECT Id, IsDeleted, ParentId, Name, IsPrivate, ContentType, BodyLength, Body, OwnerId, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, Description, IsPartnerShared, ConnectionReceivedId, ConnectionSentId FROM Attachment WHERE Id = '#{a['Id']}'").first
#   attachment = a
#   # File.open("#{Rails.root}/tmp/#{a.Name}", 'wb') { |f| f.write(a.Body) }
#   if User.where(salesforce_account_id: a['ParentId']).first.present?
#     user_attachments += 1
#     user.documents.attach(io: File.open("tmp/#{attachment.Name}", 'r+'), filename: attachment['Name'])
#     user.documents.last.update(created_at: attachment['CreatedDate'])
#     print '.'
#   elsif User.where("extra_salesforce_account_ids @> ?", "{'#{a['ParentId']}'}").present?
#         Load.where("user_ids_sms_notified @> ?", "{#{u.id}}")
#     user_attachments += 1
#     user.documents.attach(io: File.open("tmp/#{attachment.Name}", 'r+'), filename: attachment['Name'])
#     user.documents.last.update(created_at: attachment['CreatedDate'])
#     print '.'
#   elsif Project.where(salesforce_residential_project_id: a['ParentId']).first.present?
#     project_attachments += 1
#     print '-'
#     user.documents.attach(io: File.open("tmp/#{attachment.Name}", 'r+'), filename: attachment['Name'])
#     user.documents.last.update(created_at: attachment['CreatedDate'])
#   else
#     random_attachments_count += 1
#     print '?'
#
#     @random_attachments << attachment
#     User.first.documents.attach(io: File.open("#{Rails.root}/tmp/#{attachment.Name}", 'r+'), filename: "#{attachment['Name']}")
#     User.first.documents.last.update(created_at: attachment['CreatedDate'])
#   end
#   rescue
#   end
#   count += 1
# end
@docusign = @client.query("select Id, Name from dsfs__DocuSign_Status__c WHERE Id = 'a0E1N00000GV7egUAD'").first
#
# User.where(extra_salesforce_account_id: a['ParentId']).first.present?
# 0013m000024eNsiAAE
#
# LEADS >> Contacts
# @client = SalesforceClient.new.client
@leads = @client.query("SELECT Id, FirstName, LastName, Email, Phone, MobilePhone, Opportunity__c, Canvass_ID__c, LeadSource, CreatedDate, Street, City, State, postalCode, latitude, longitude, FieldM_Email__c FROM Lead")
# @lead = @client.find('Lead', '00Q1N00000YO3acUAD')

print "\nSeeding Contacts & Addresses\n"
@leads.each do |lead|
  project_id = nil
  # account_user_id = nil

  first_name = lead["FirstName"]
  last_name = lead["LastName"]
  email = lead["Email"]
  phone = lead["Phone"]
  phone1 = lead["MobilePhone"]
  salesforce_lead_id = lead["Id"]
  salesforce_opportunity_id = lead["Opportunity__c"]
  canvass_contact_id = lead["Canvass_ID__c"]
  lead_source = lead["LeadSource"]
  created_at = lead["CreatedDate"]

  if salesforce_opportunity_id.present?
    project_id = Project.where(salesforce_opportunity_id: salesforce_opportunity_id).first&.id
  end

  user = User.where(email: lead["FieldM_Email__c"]).first
  account_user = if user.present?
    user.accounts.personal.first.account_users.first
    # account_user_id = account_user.id
  else
    User.first.accounts.personal.first.account_users.first
    # account_user_id = account_user.id
  end

  contact = Contact.create(
    first_name: first_name,
    last_name: last_name,
    email: email,
    phone: phone,
    phone1: phone1,
    salesforce_lead_id: salesforce_lead_id,
    salesforce_opportunity_id: salesforce_opportunity_id,
    canvass_contact_id: canvass_contact_id,
    lead_source: lead_source,
    created_at: created_at,
    user_id: account_user.user.id,
    account_id: account_user.account
  )
  print "."

  street = lead["Street"]
  city = lead["City"]
  state = lead["State"]
  postal_code = lead["PostalCode"]
  latitude = lead["Latitude"]
  longitude = lead["Longitude"]
  created_at = lead["CreatedDate"]

  # if street.nil? && city.nil? && state.nil? && postal_code.nil?
  # street = lead['Address']["street"]
  # city = lead['Address']["city"]
  # state = lead['Address']["state"]
  # postal_code = lead['Address']["postalCode"]
  # latitude = lead['Address']["latitude"]
  # longitude = lead['Address']["longitude"]

  street_name = street.present? ? street + " " : ""
  city_name = city.present? ? city + ", " : ""
  state_name = state.present? ? state + " " : ""
  address_long = [street_name, city_name, state_name, postal_code].join

  address = Address.create(
    address: address_long,
    street: street,
    city: city,
    state: state,
    postal_code: postal_code,
    latitude: latitude,
    longitude: longitude,
    created_at: created_at,
    salesforce_lead_id: salesforce_lead_id,
    salesforce_opportunity_id: salesforce_opportunity_id
  )
  ContactAddress.create(
    contact_id: contact.id,
    address_id: address.id,
    project_id: project_id
  )
  if project_id.present?
    project = Project.find(project_id)
    project.address_id = address.id
    project.save
  end
  print "."
  # end
end

# Create Appointments
# Consultation
# Site Audit
# Scheduled Install

# @client = SalesforceClient.new.client

# opportunities = @client.query('SELECT Name, Proposal_Requested_Date_Time__c, AccountId, Field_Marketer1__c, Field_Marketer__c, Sat__c, Appointment_Date__c, FM_Expected_Pay_Date__c, FM_Commission__c, Id, Sat_Date__c, Proposal_Due_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Proposal_QC_d_By__c, Canvass_Status__c, Street_Address__c, City__c, State__c, Zip__c FROM Opportunity WHERE Proposal_Requested__c = true AND Proposal_Requested_Date_Time__c > 2020-01-01T00:00:00Z')
@opportunities = @client.query('SELECT Id,
 Appointment_Date__c,
 Lead__c,
 Residential_Projects__c,
 CreatedDate,
 Sat__c,
 Field_Marketer__c,
 Field_Marketer1__c,
 Field_Marketer_Email__c,
 Energy_Consultant_Email_Formula__c,
 Field_Marketer_Team_Name__c,
 Account_DO_NOT_USE__c,
 AccountId,
 CloseDate,
 Canvass_Status__c,
 Street_Address__c,
 City__c,
 State__c,
 Zip__c
  FROM Opportunity')
# opportunity = @client.find( 'Opportunity', '0061N00000d3kHpQAI')
# opportunity = @client.find( 'Opportunity', salesforce_opportunity_id)

# Create Appointments with appointment_type: 'consultation'
print "\nSeeding Appointments\n"
count = 0
@opportunities.each do |opportunity|
  salesforce_opportunity_id = opportunity["Id"]
  salesforce_lead_id = opportunity["Lead__c"]
  salesforce_residential_project_id = opportunity["Residential_Projects__c"]
  user = if opportunity["Energy_Consultant_Email_Formula__c"].present?
    User.find_by(email: opportunity["Energy_Consultant_Email_Formula__c"])
  elsif opportunity["AccountId"].present?
    User.find_by(salesforce_account_id: opportunity["AccountId"])
  elsif opportunity["Account_DO_NOT_USE__c"].present?
    User.find_by(salesforce_account_id: opportunity["Account_DO_NOT_USE__c"])
  elsif opportunity["Field_Marketer_Email__c"].present? && User.find_by(email: opportunity["Field_Marketer_Email__c"]).present?
    User.find_by(email: opportunity["Field_Marketer_Email__c"])
  elsif opportunity["Field_Marketer1__c"].present?
    User.find_by(salesforce_account_id: opportunity["Field_Marketer1__c"])
  else
    count += 1
    50.times do
      print "x"
    end
    print "\n#{count}"
  end
  account_id = user&.accounts&.impersonal&.first&.id

  # quality_sit = opportunity['Sat__c']
  date = opportunity["Appointment_Date__c"]
  unless date.present?
    if opportunity["CloseDate"].present?
      date = opportunity["CloseDate"]
    end
  end
  created_at = opportunity["CreatedDate"]
  # project_id = Project.where(salesforce_residential_project_id: 'a001N00001JKsd7QAD').first&.id
  project = Project.find_by(salesforce_residential_project_id: salesforce_residential_project_id)
  project_id = project&.id || nil
  appointment_status = opportunity["Canvass_Status__c"] || "scheduled"
  address_id = if project&.address.present?
    project.address.id
  elsif !salesforce_opportunity_id.nil? && Address.find_by(salesforce_opportunity_id: salesforce_opportunity_id).present?
    Address.find_by(salesforce_opportunity_id: salesforce_opportunity_id).id
  elsif !salesforce_lead_id.nil? && Address.find_by(salesforce_lead_id: salesforce_lead_id).present?
    Address.find_by(salesforce_lead_id: salesforce_lead_id).id
  elsif salesforce_lead_id.nil? && !salesforce_opportunity_id.nil?
    street = opportunity["Street_Address__c"]
    city = opportunity["City__c"]
    state = opportunity["State__c"]
    postal_code = opportunity["Zip__c"]
    latitude = nil
    longitude = nil
    created_at = opportunity["CreatedDate"]

    street_name = street.present? ? street + " " : ""
    city_name = city.present? ? city + ", " : ""
    state_name = state.present? ? state + " " : ""
    address_long = [street_name, city_name, state_name, postal_code].join

    Address.create(
      address: address_long,
      street: street,
      city: city,
      state: state,
      postal_code: postal_code,
      latitude: latitude,
      longitude: longitude,
      created_at: created_at,
      salesforce_lead_id: salesforce_lead_id, # nil
      salesforce_opportunity_id: salesforce_opportunity_id
    ).id
  end

  # if lead_id.present?
  #   # Clean up data imported from Salesforce Lead Object
  #   contact = Contact.where(salesforce_lead_id: lead_id).first
  #   contact.first_name = opportunity['FirstName']
  #   # update any other fields as well
  #   contact.save
  # else
  #   contact = Contact.create
  # end
  # Use the fm's email first. If we can't find a user with that email, then we will find them by the account id.
  created_by_id = if opportunity["Field_Marketer_Email__c"].present? && User.where(email: opportunity["Field_Marketer_Email__c"]).present?
    User.where(email: opportunity["Field_Marketer_Email__c"])&.first
  elsif opportunity["Field_Marketer1__c"].present? && User.where(salesforce_account_id: opportunity["Field_Marketer1__c"]).present?
    User.where(salesforce_account_id: opportunity["Field_Marketer1__c"])&.first
  elsif opportunity["Account_DO_NOT_USE__c"].present? && User.where(salesforce_account_id: opportunity["Account_DO_NOT_USE__c"]).present?
    User.where(salesforce_account_id: opportunity["Account_DO_NOT_USE__c"])&.first
  end
  # Use the EC's email first. If we can't find a user with that email, then we will find them by the account id.
  # scheduled_with_id = opportunity['Energy_Consultant_Email_Formula__c']
  scheduled_with_id = if opportunity["Energy_Consultant_Email_Formula__c"].present? && User.where(email: opportunity["Energy_Consultant_Email_Formula__c"]).present?
    User.where(email: opportunity["Energy_Consultant_Email_Formula__c"])&.first
  end

  created_by_position_id = User.where(id: created_by_id).first&.job_position&.id

  # This was blowing up on creating appointments that did not have an address, somehow we have opportunities that don't have an id, so when we are locating an address with an opporunity_id it comes back as nil. We should look more into this when we start flushing out the salesforce import rake task
  next if user.nil?
  Appointment.create(
    salesforce_opportunity_id: salesforce_opportunity_id,
    salesforce_residential_project_id: salesforce_residential_project_id,
    source: "",
    created_at: created_at,
    # quality_sit: quality_sit,
    address_id: address_id,
    account_id: account_id,
    appointment_type: "consult",
    date: date,
    project_id: project_id,
    created_by_id: created_by_id,
    scheduled_with_id: scheduled_with_id,
    created_by_position_id: created_by_position_id,
    appointment_status: appointment_status
  )
  print "."

  # contact.addresses.create
  # contact.appointments.create
  # Create addresses and other stuff
end

# Create Appointments with appointment_type: 'site audit'
# Create Appointments with appointment_type: 'scheduled install'
# @client = SalesforceClient.new.client
@projects = @client.query('SELECT Id,
 Site_Audit_Date__c,
 Opportunity__c,
 Site_Audit_Notice_Sent_Date_Time__c,
 Install_Scheduled_Date_Time__c,
 CreatedDate,
 Install_Date__c,
 Install_Scheduled__c,
 Project_Cancelled__c,
 Pending_Cancellation__c,
 Canceled_Reason__c,
 Cancellation_Request_Reason__c,
 Install_Rescheduled_Reason__c,
 Reimbursement_Reason__c,
 On_Hold_Reason__c,
 OnHOldreason__c,
 Install_Status_Formula__c,
 Install_Complete__c,
 Site_Audit_Complete_Date_Time__c
  FROM Residential_Projects__c')
# project = @client.find("Residential_Projects__c", "a001N00001MFy9DQAT")

print "\nIterating over projects\n"
@projects.each do |project|
  # Setting variables for Site Audit from Projects
  salesforce_opportunity_id = project["Opportunity__c"]
  salesforce_residential_project_id = project["Id"]
  # quality_sit = nil
  appointment_type = "site audit"
  address_id = if project.address.present?
    project.address.id
  elsif !salesforce_opportunity_id.nil? && Address.find_by(salesforce_opportunity_id: salesforce_opportunity_id).present?
    Address.find_by(salesforce_opportunity_id: salesforce_opportunity_id).id
    # else
    #   binding.pry
  end

  appointment_status = if project["Site_Audit_Info_Needed__c"] == true
    "site audit needed"
  else
    "complete"
  end
  appointment_status_reason = project["Canvass_Status__c"]
  # TODO: if - then status is left and reason is right
  created_at = project["Site_Audit_Notice_Sent_Date_Time__c"] || project["CreatedDate"]
  date = project["Site_Audit_Complete_Date_Time__c"] || project["Site_Audit_Date__c"] || created_at
  project_id = Project.where(salesforce_residential_project_id: project["Id"]).first&.id

  # unless created_at.present? || date.present?
  # binding.pry
  # end
  # Importing Site Audits from Projects
  Appointment.create(
    salesforce_opportunity_id: salesforce_opportunity_id,
    salesforce_residential_project_id: salesforce_residential_project_id,
    created_at: created_at,
    address_id: address_id,
    appointment_type: appointment_type,
    appointment_status: appointment_status,
    appointment_status_reason: appointment_status_reason,
    date: date,
    project_id: project_id
  )

  # Setting variables for Scheduled Installs from Projects
  # date = nil
  if project["Project_Cancelled__c"] == true
    appointment_status_reason = project["Canceled_Reason__c"]
    appointment_status = "cancelled"
  elsif project["Pending_Cancellation__c"] == true
    appointment_status_reason = project["Canceled_Reason__c"]
    appointment_status = "pending cancellation"
  elsif project["Install_Complete__c"] == true
    appointment_status_reason = "Project Complete"
    appointment_status = "complete"

  elsif project["Install_Rescheduled_Reason__c"].present?
    appointment_status_reason = project["Install_Rescheduled_Reason__c"]
    appointment_status = "rescheduled"

  elsif project["Install_Scheduled__c"] == true
    appointment_status_reason = ""
    appointment_status = "pending install"

  elsif project["Canceled_Reason__c"].present?
    appointment_status_reason = project["Canceled_Reason__c"]
    appointment_status = "cancelled 1"
    # binding.pry
  elsif project["Cancellation_Request_Reason__c"].present?
    appointment_status_reason = project["Cancellation_Request_Reason__c"]
    appointment_status = "cancelled 2"
  elsif project["Reimbursement_Reason__c"].present?
    appointment_status_reason = project["Reimbursement_Reason__c"]
    appointment_status = "reimbursed 3"
  elsif project["On_Hold_Reason__c"].present?
    appointment_status_reason = project["On_Hold_Reason__c"]
    appointment_status = "on hold 4"
  elsif project["OnHOldreason__c"].present?
    appointment_status_reason = project["OnHOldreason__c"]
    appointment_status = "on hold 5"
  elsif project["Install_Status_Formula__c"].present? # .includes(['Install Scheduled', 'Install Complete', 'Cancelled', 'Project Complete'])
    appointment_status_reason = project["Install_Status_Formula__c"]
    appointment_status = "?"
  else
    appointment_status_reason = nil
    appointment_status = "scheduled"
  end
  # appointment_status_reason = project['Reassigned_Reason__c']

  salesforce_opportunity_id = project["Opportunity__c"]
  salesforce_residential_project_id = project["Id"]
  # quality_sit = nil
  date = project["Install_Date__c"]
  appointment_type = "install"
  # appointment_status_reason = project['Install_Rescheduled_Reason__c']
  created_at = project["Install_Scheduled_Date_Time__c"] || project["CreatedDate"]
  project_id = Project.where(salesforce_residential_project_id: project["Id"]).first.id

  # Importing Scheduled Installs from Projects
  if date.present?
    # We require account_id and user_id in order to create appointments, so these installs and site audit appointments are not being created when we run the seeds file.
    Appointment.create(
      salesforce_opportunity_id: salesforce_opportunity_id,
      salesforce_residential_project_id: salesforce_residential_project_id,
      created_at: created_at,
      address_id: address_id,
      account_id: account_id,
      # quality_sit: nil,
      appointment_type: appointment_type,
      appointment_status: appointment_status,
      appointment_status_reason: appointment_status_reason,
      date: date,
      project_id: project_id
    )
    print "."
  end
end

count = 0
Project.find_each do |project|
  o_id = project.salesforce_opportunity_id
  address = Address.where(salesforce_opportunity_id: o_id)&.first
  project.address_id = address&.id
  if project.save
    count += 1
  end
end

print '\nFinished Seeding Data from Salesforce'

#
# def import
#   @count = 0
#   @attachments.each do |attachment|
#     @attachment = @client.query("select Id, Name, Body from Attachment WHERE Id = '#{attachment['Id']}'").first
#     user = User.where(salesforce_account_id: @attachment['ParentId']).first
#     if user.present?
#       user.documents.attach(io: File.open(@attachment['Name']), filename: @attachment['Name'])
#       @count += 1
#     end
#   end
# end
# "#{resp.env.url.to_s.chomp('Body')}#{attachment['Name']}"
# @attachment.ContentType =  "application/pdf"

# @client = SalesforceClient.new.client
# project = @client.find('Residential_Projects__c', '0051N000005RIgMQAW')
# project = @client.find('Document', '0151N000003WU46QAG')
# opportunity = @client.find('Opportunity', '0051N000005RIgMQAW')
# installer = @client.find('Installer', '0051N000005RIgMQAW')
# docusign = @client.find('dsfs__DocuSign_Status__c', 'a0E1N00000GV7egUAD')
# account = @client.find('Account', '0051N000005RIgMQAW')
#
# residential_projects = @client.query('SELECT Id FROM Residential_Projects__c')
# # https://horizonpower.my.salesforce.com/services/data/v47.0/query/?q=SELECT Site_Audit_Date__c, Account__c, Field_Marketer__c, Field_Marketer1__c, Install_Complete__c, Install_Complete_Date_Time__c, Site_Audit_Notice_Sent_Date_Time__c, Install_Scheduled_Date_Time__c, Id, Name, Installer__c, Install_Date__c, Finance_Partner__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c,  X1st_Funding_Payment_Amount__c, X1st_Funding_Payment_Received__c, X2nd_Funding_Payment_Amount__c, X1st_Funding_Received_Date2__c, X2nd_Funding_Payment_Received__c, Loan_Docs_Signed_Date_Time__c, X2nd_Funding_Payment_Received_Date__c, Funding_Updates__c, Loan_Approved_Date_Time__c, Signing_Updates__c, Completion_Certificate_Signed_Date_Time__c, COC_sent_to_GCU__c, GCU_COC_Signed__c, Substantial_Completion_Submitted__c, PTO_Approved__c FROM Residential_Projects__c WHERE Site_Audit_Date__c != null AND Site_Audit_Date__c > 2020-01-01
#
# # lead = @client.find('Lead', '00Q3m00000xWKCeEAO')
# # project = @client.find('Residential_Projects__c', 'a001N00001TLePrQAL')
#
# @client.find('Id FROM _lead')
# opportunity = @client.find('Opportunity', '0063m00000jgP20AAE')
# opportunities = @client.query('SELECT Name, Proposal_Requested_Date_Time__c, AccountId, Field_Marketer1__c, Field_Marketer__c, Sat__c, Appointment_Date__c, FM_Expected_Pay_Date__c, FM_Commission__c, Id, Sat_Date__c, Proposal_Due_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Proposal_QC_d_By__c, Canvass_Status__c, Street_Address__c, City__c, State__c, Zip__c FROM Opportunity WHERE Proposal_Requested__c = true AND Proposal_Requested_Date_Time__c > 2020-01-01T00:00:00Z')
# # https://horizonpower.my.salesforce.com/services/data/v47.0/query/?q=SELECT Name, Proposal_Requested_Date_Time__c, AccountId, Field_Marketer1__c, Field_Marketer__c, Sat__c, Appointment_Date__c, FM_Expected_Pay_Date__c, FM_Commission__c, Id, Sat_Date__c, Proposal_Due_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Proposal_QC_d_By__c, Canvass_Status__c, Street_Address__c, City__c, State__c, Zip__c FROM Opportunity WHERE Proposal_Requested__c = true AND Proposal_Requested_Date_Time__c > 2020-01-01T00:00:00Z
#
# account = @client.find('Account', '0013m00002FkrXKAAZ')
#
# status = account['Status__c'] == 'Active'
# User.create(email: account['Company_Email__c'], name: account['Name'], birth_date: account['Birthdate__c'], shirt_size: account['Shirt_Size__c'], active: status, password: "123123", password_confirmation: "123123", terms_of_service: true)
#
#
#
#
# # Find all projects
# # @projects.first.each do |project|
# # opportunity = @client.find('Opportunity', project["Opportunity__c"])
# # lead = @client.find('Lead', opportunity["Lead__c"])
# # end
# #
# @accounts = @client.query('SELECT Id FROM Account')
#
#
# residential_projects = @client.query('SELECT Id FROM Residential_Projects__c')
# residential_projects.each do |sf_project|
#   project = @client.find('Residential_Projects__c', sf_project['Id'])
#   unless project["Opportunity__c"].nil?
#     opportunity = @client.find('Opportunity', project["Opportunity__c"])
#     unless opportunity["Lead__c"].nil?
#       lead = @client.find('Lead', opportunity["Lead__c"])
#     end
#   end
# end
#
# project['']
#  puts "
#  Site_Audit_Date__c: #{project['Site_Audit_Date__c']}
#  Account__c: #{project['Account__c']}
#  Field_Marketer__c: #{project['Field_Marketer__c']}
#  Field_Marketer1__c: #{project['Field_Marketer1__c']}
#  Install_Complete__c: #{project['Install_Complete__c']}
#  Install_Complete_Date_Time__c: #{project['Install_Complete_Date_Time__c']}
#  Site_Audit_Notice_Sent_Date_Time__c: #{project['Site_Audit_Notice_Sent_Date_Time__c']}
#  Install_Scheduled_Date_Time__c: #{project['Install_Scheduled_Date_Time__c']}
#  Id: #{project['Id']}
#  Name: #{project['Name']}
#  Installer__c: #{project['Installer__c']}
#  Install_Date__c: #{project['Install_Date__c']}
#  Finance_Partner__c: #{project['Finance_Partner__c']}
#  Final_System_Size__c: #{project['Final_System_Size__c']}
#  Ground_Mount__c: #{project['Ground_Mount__c']}
#  Pending_Cancellation__c: #{project['Pending_Cancellation__c']}
#  Project_Cancelled__c: #{project['Project_Cancelled__c']}
#  X1st_Funding_Payment_Amount__c: #{project['X1st_Funding_Payment_Amount__c']}
#  X1st_Funding_Payment_Received__c: #{project['X1st_Funding_Payment_Received__c']}
#  X2nd_Funding_Payment_Amount__c: #{project['X2nd_Funding_Payment_Amount__c']}
#  X1st_Funding_Received_Date2__c: #{project['X1st_Funding_Received_Date2__c']}
#  X2nd_Funding_Payment_Received__c: #{project['X2nd_Funding_Payment_Received__c']}
#  Loan_Docs_Signed_Date_Time__c: #{project['Loan_Docs_Signed_Date_Time__c']}
#  X2nd_Funding_Payment_Received_Date__c: #{project['X2nd_Funding_Payment_Received_Date__c']}
#  Funding_Updates__c: #{project['Funding_Updates__c']}
#  Loan_Approved_Date_Time__c: #{project['Loan_Approved_Date_Time__c']}
#  Signing_Updates__c: #{project['Signing_Updates__c']}
#  Completion_Certificate_Signed_Date_Time__c: #{project['Completion_Certificate_Signed_Date_Time__c']}
#  COC_sent_to_GCU__c: #{project['COC_sent_to_GCU__c']}
#  GCU_COC_Signed__c: #{project['GCU_COC_Signed__c']}
#  Substantial_Completion_Submitted__c: #{project['Substantial_Completion_Submitted__c']}
#  PTO_Approved__c: #{project['PTO_Approved__c']}"
#
#
#
#
# Installer.salesforce_installer_id
# User.salesforce_accounts_id
#
# Project.salesforce_residential_project_id
#
# # Residential Project
# Project.new
#
# Contact.new
# Address.new
#
# # Opportunity
#
# # Lead
# Appointment.new # Initial appointment
#
#
# @client = SalesforceClient.new.client
# opportunity = @client.find('Opportunity', '0063m00000jgP20AAE')
# opportunities = @client.query('SELECT Name, Proposal_Requested_Date_Time__c, AccountId, Field_Marketer1__c, Field_Marketer__c, Sat__c, Appointment_Date__c, FM_Expected_Pay_Date__c, FM_Commission__c, Id, Sat_Date__c, Proposal_Due_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Proposal_QC_d_By__c, Canvass_Status__c, Street_Address__c, City__c, State__c, Zip__c FROM Opportunity WHERE Proposal_Requested__c = true AND Proposal_Requested_Date_Time__c > 2020-01-01T00:00:00Z')
#
# def appointment_date(opportunity)
#   if opportunity['Appointment_Date__c'].nil?
#     Time.parse(opportunity['Appointment_Date1Time__c'])
#   else
#     Time.parse(opportunity['Appointment_Date__c'])
#   end
# end
#
# def qs(opportunity)
#   opportunity['Sat__c'] || opportunity['Sat_Date__c'].present?
# end
#
# @au = AccountUser.first
# @job_position = JobPosition.first
# @address = Address.create!
# @project = @address.project.create!(installer: Installer.first)
#
# # created_by =
# # unless Field_Marketer1__c nil?
# #   Field_Marketer1__c
# #   created_by =  @client.find('Account', '0013m000029QcUWAA0')
# # else
# #   Field_Marketer__c
# #   Find user by name
# # end
# #
# # created_by_postion =
# #
# #
# # contact = AccountUser.first.contacts.create!
# # contact.address.create
# # Project.create
# # Appointment
#
# def new_appointment(opportunity)
#   Appointment.new(
#     date: appointment_date(opportunity),
#     quality_sit: qs(opportunity),
#     appointment_type: 'Initial Appointment',
#     source: 'Salesforce Import',
#     created_at: opportunity['CreatedDate'],
#     updated_at: Time.now,
#     project_id: @project,
#     created_by_position_id: @job_position.id,
#     created_by: @au,
#     scheduled_with: @au
#   )
# end
#
#
# Opportunities.each do |opportunity|
#   Appointment.create(appointment_type: 'Initial Appointment')
#   if opportunity['Residential_Projects__c'].present? # residential project is linked to opportunity
#     project = @client.find('Residential_Projects__c', opportunity['Residential_Projects__c']) # FIND THE ASSOCIATED PROJECT
#     @client.find('Account', project['Account__c']) # EC_ID >> Add to initial appointment
#     Appointment.create(appointment_type: 'Site Audit')
#   end
# end
#
#
# Appointment.new # Initial Appointment
# # QS?
# Appointment.new # Site Audit Scheduled
#     # Residential Project
# Appointment.new # Scheduled Installed
# Appointment.new # Install completed
#
# # Initial appointment when an ec sits
#
# # lead = when the initial appointment was made #created_at
# # sit = if the initial appointment happen and counts toward the EC and FM #boolean
# # close when was the site audit was scheduled #appointment_type: 'Site Audit' created_at
# # scheduled installs when that happened #appointment_type: 'Install'
# #
# # Account >> JobPosition
# # Account >> User
# # Team__c >> Account
# # Installer >> Installers
# #
