class StaticController < ApplicationController
  before_action :authenticate_user!, only: [:leaderboard, :onboarding, :gitbook, :roadmap, :analytics]
  before_action :set_session_referrer, only: [:contest]

  layout :resolve_layout
  respond_to :html

  def index
  end

  def contest
    # contest_id = Contest.all.map {|i| i.id if i.active == 'active'}
    @referral = Referral.new(
      contest_id: nil,
      referrer_contact: @referrer,
      referrer_first_name: @referrer&.first_name,
      referrer_last_name: @referrer&.last_name,
      referrer_phone: @referrer&.phone,
      referrer_email: @referrer&.email,
      user_id: current_user&.id
    )
    @text_color = "text-white"
  end

  def resolve_layout
    action_name == "contest" ? "lead_pages" : "application"
  end

  def leaderboard
    redirect_to onboarding_path unless current_user.active
    # TODO: refactor needed! Views are too dependent on variables from here. We should aim to have the least # needed
    @leaderboard = if params[:board].present?
      params[:board]
    else
      current_user.sales? ? 'sales' : 'installers'
    end
    accounts = if @leaderboard == 'installers'
                 Account.solar_installer_accounts
               else
                 Account.active_sales_accounts
               end
    @reps = User.sales.where(active: true).includes(:accounts, :job_position).with_attached_avatar.order("first_name ASC, last_name ASC")

    field_marketers = User.field_marketers
    field_marketers = field_marketers.search_by_params(params[:team]) if params[:team].present?
    @fms = field_marketers.sort_by { |fm| -fm.this_fm_week_points }

    all_closers = User.closers
    all_closers = all_closers.search_by_params(params[:team]) if params[:team].present?
    @closers = all_closers.sort_by { |closer| -closer.this_closers_week_points }
    @performance_stats = PerformanceStat.leaderboard_stats(accounts, params[:end_at], params[:time_period])
    @teams = accounts
    @reps = @teams.first.account_users.map(&:user) if @teams.count == 1
    @company_stats = PerformanceStat.company_kpi(@performance_stats)
  end

  def installers_leaderboard
    @teams = Account.impersonal.where(active: true).where.not(installer_id: nil)
  end

  def onboarding
    # TODO: StandardRB says "Lint/UselessAssignment: Useless assignment to variable - `params`."
    params = "?ref=#{Rails.env.first}&user_id=#{current_user.secure_public_id}"
    job_position = current_user&.job_position || JobPosition.first # Assuming sales if not specified
    @sales = job_position.department&.name == "Sales"

    # This is not a good example to work from. This is avoiding any migrations or extra work at the moment.
    @links = current_user.document_links

    # TODO: Onboarding https://gorails.com/episodes/user-onboarding-progress-bar
    @dynamic_form = DynamicForm.find_by(use_case: "onboarding")
    redirect_to leaderboard_path unless !current_user.active
  end

  def code_snippets
    @user = User.first
    @random = ["Casa de Ochoa", "Jimmy John's", "Blisters", "Guerreros's Mexican Food", "Five Guys", "The Hickory", "Adam's Mongolian",
      "Mill Hollow Restaurant", "Gator Jack's", "Righteous Slice", "Taco Bell", "Costa Vida", "Wendy's", "Broulim's"].sample
    @note = Note.last
  end

  def about
    @employees = User.where(active: true)
    @job_positions = JobPosition.all
    @departments = Department.all
    @ceo = User.find_by(email: "judd@horizonpwr.com")
  end

  def roadmap
    @planned_feedbacks = Feedback.where(status: "planned").sort_by(&:updated_at)
    @progressing_feedbacks = Feedback.where(status: "in_progress").sort_by(&:updated_at)
    @completed_feedbacks = Feedback.where(status: "complete").where("updated_at > ?", 30.days.ago).sort_by(&:updated_at)
  end

  def pricing
    redirect_to root_path, alert: t(".no_plans") unless Plan.without_free.exists?
  end

  def podcast
  end

  def terms
  end

  def privacy
  end

  def analytics
    # @options = %w(Id, OwnerId, IsDeleted, Name, RecordTypeId, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, LastActivityDate, LastViewedDate, LastReferencedDate, ConnectionReceivedId, ConnectionSentId, Opportunity__c, Site_Auditor_Lookup__c, Installer_Email__c, Account__c, Street_Address__c, City__c, State__c, Zip__c, Email_Address__c, Home_Phone__c, Mobile_Phone__c, Property_Type__c, Power_Company__c, Utility_Account_Number__c, Meter_Number__c, HOA_Name__c, Hours_Sunlight_Install_Complete_1st_Paym__c, Preliminary_System_Size__c, Panel_Model__c, Customer_Approved_Design__c, Panel_Qty__c, Inverter_Model__c, Inverter_Size_kW__c, Inverter_Qty__c, Install_Status__c, Customer_Number__c, Age__c, On_Hold__c, On_Hold_Date__c, On_Holdlist_del__c, Project_Cancelled__c, Project_Cancelled_Date__c, Site_Audit_Date__c, Site_Audit_Scheduled__c, Site_Audit_Complete__c, Site_Audit_Time__c, Final_Design_Uploaded__c, Days_Permit_to_ICX_Submission__c, Engineering_Complete__c, Engineering_Complete_Date__c, Permit_Submitted__c, of_Days_Permit_Pack_Request__c, Permit_Approved__c, Completion_Certificate_Sent__c, Install_Scheduled__c, Install_Start_Date__c, Install_Complete__c, Completion_Certificate_Sent_Date_Time__c, Inspection_Scheduled__c, Completion_Certificate_Signed__c, Received_from_Structural_Engineer__c, Inspection_Passed__c, Completion_Certificate_Signed_Date_Time__c, Delete_Install_Canceled__c, Inspection_Date__c, X1st_Inspection_Failed__c, Completion_Photos_Uploaded__c, PM2_Hrs_GCU_Cash_Install_Complete_2_Paym__c, Interconnection_App_Submitted__c, Completion_Photos_Uploaded_Date_Time__c, PM3_Hrs_GCU_Cash_Install_Complete_2_Paym__c, Installation_Agreement_Uploaded__c, Installation_Agreement_Upload_Date_Time__c, System_Active__c, Project_Complete__c, Project_Complete_Date__c, On_Hold_Reason__c, Close_Date_1__c, Close_Date__c, Monitoring_Setup_Complete__c, Perfect_Packet_Date__c, Monitoring_Setup_Complete_Date_Time__c, Substantial_Completion_with_Financier__c, ICX_Submitted_Date__c, ICX_Approved__c, Financier_Substantial_Completion_Date_Ti__c, FormulaToUpdateStage__c, Quote_Type__c, Loan_Amount__c, Dealer_Fee__c, Finance_Partner__c, Panel_Size__c, Amount__c, Ground_Mount__c, Stage_2__c, Recieved_PE_Stamp__c, Received_PE_Stamp_Date__c, PTO_Approved__c, PTO_Submitted__c, Electrical_Permit_Approved__c, Electrical_Permit_Approved_Date_Time__c, Install_Started__c, HOA_Application_Approved__c, HOA_Application_Submitted__c, Install_Day_Call_Complete__c, True_Up__c, Requested_Contractor_Quote__c, Quote_Requested_Date_Time__c, Design_Sent_To_Rep__c, Sent_PE_Stamp__c, Quote_Requested_From__c, Reassigned_Reason__c, Quote_Notes__c, Received_Quote__c, Docs_Uploaded__c, Docs_Uploaded_Date__c, Received_Quote_Date_Time__c, Interconnection_App_Approved__c, Needing_Bill__c, PM2_hrs_Inspection_Approved_PTO_Submitt__c, PM3_hrs_Inspection_Approved_PTO_Submitt__c, PM2_hrs_Install_Complete_Inspection_Sch__c, PM3_Hrs_Install_Complete_Inspection_Sch__c, Cancellation_Request__c, Site_Audit_Notice_Sent__c, Cancellation_Request_Date_Time__c, Contract_Signed__c, Contract_Signed_Date__c, Install_Date__c, Received_from_Structural_Engineer_Date__c, Dealer_Fee_Formula__c, Price_Per_Watt__c, Final_Design_Sent_for_Writing__c, True_Up_Date__c, OnHOldreason__c, Waiting_for_Signature__c, Energy_Consultant_Email__c, PM2_hrs_Install_Scheduled_Loan_Approved__c, Field_Marketer__c, Total_Revenue__c, Rough_Inspection_Needed__c, Baseline_Cost__c, Annual_Usage__c, Install_Time__c, Cancellation_Request_Reason__c, Engineer_Stamp_Received__c, Interconnection_Program__c, X1st_Inspection_Failed_Notes__c, Interconnection_Docs_Complete__c, Installer_Notes__c, Referral__c, Site_Audit_Date_Time__c, Site_Audit_Complete_Date_Time__c, Site_Audit_Notice_Sent_Date_Time__c, Final_Design_Sent_for_Writing_Date_Time__c, Final_Design_Uploaded_Date_Time__c, Design_Sent_to_Rep_Date_Time__c, Customer_Approved_Design_Date_Time__c, Engineer_Stamp_Received_Date_Time__c, Interconnection_Docs_Complete_Date_Time__c, Interconnection_App_Submitted_Date_Time__c, Interconnection_App_Approved_Date_Time__c, HOA_Application_Submitted_Date_Time__c, HOA_Application_Approved_Date_Time__c, Permit_Submitted_Date_Time__c, Permit_Approved_Date_Time__c, Install_Scheduled_Date_Time__c, Install_Day_Call_Complete_Date_Time__c, Install_Complete_Date_Time__c, Inspection_Scheduled_Date_Time__c, Inspection_Passed_Date_Time__c, X1st_Inspection_Failed_Date_Time__c, PM3_hrs_Install_Scheduled_Loan_Approved__c, PM2_hrs_Install_Scheduled_Permit_Pack__c, PTO_Submitted_Date_Time__c, PTO_Approved_Date_Time__c, Electrical_Permit_Submitted__c, Electrical_Permit_Submitted_Date_Time__c, Set_Up_Customers_Production_Watch__c, Set_Up_Customers_Production_Watch_Date_T__c, Follow_Up_Call_Complete__c, Follow_Up_Call_Complete_Date_Time__c, PM3_hrs_Install_Scheduled_Permit_Pack__c, PM2_hrs_Interconnection_Submitted_Approv__c, Energy_Consultant_Email1__c, Cancellation_Issue_Resolved__c, DesignerOLD__c, Inspection_Time__c, Install_Status_Formula__c, PM3_hrs_Interconnection_Submitted_Approv__c, PM2_hrs_Loan_Approved_Docs_Signed__c, Electrical_Inspection_Scheduled_DateTime__c, Site_Audit_Photos_Uploaded__c, Site_Audit_Photos_Uploaded_Date_Time__c, Engineering_Submitted__c, Engineering_Submitted_Date__c, Customer_Approved_Interconnection_App__c, Cust_Approved_Interconnection_Date_Time__c, PM3_hrs_Loan_Approved_Docs_Signed__c, Final_Design_Complete__c, Final_Design_Complete_Date_Time__c, PM2_hrs_Permit_Submitted_Approved__c, PM3_Hrs_Permit_Submitted_Approved__c, Docs_Sent_to_Install_Partner__c, Docs_Sent_to_Install_Partner_Date_Time__c, PM2_hrs_Permit_Pack_Received_ICX_App__c, Completion_Docs_Uploaded__c, Completion_Docs_Uploaded_Date_Time__c, Structural_Engineer__c, Reimbursement_Request__c, Loan_Payment_Due_Date__c, Parent_Override_Paid__c, Requested_Reimbursement_Amount__c, Reimbursement_Complete__c, Parent_Override_Paid_Date__c, Actual_Reimbursement_Amount__c, Reimbursement_Reason__c, Work_Order_Cost__c, True_Up_Cost__c, Substantial_Completion_Cost__c, Dayssitesuditcomplete__c, of_Days_Design_Complete__c, of_Days_Permit_Submitted__c, of_Days_Ready_to_Install__c, of_Days_Install_Scheduled__c, of_days_Install_Complete__c, PM3_hrs_Permit_Pack_Received_ICX_App__c, of_Days_Inspection_Passed__c, of_Days_PTO__c, of_Days_Project_Complete__c, Projected_of_Days_to_Install_Date__c, Projected_Install_Date_Formula__c, Permitting_Type__c, Reimbursement_Request_Date__c, Reimbursement_Complete_Date__c, Designer__c, Final_System_Size__c, X1st_Funding_Received_Date2__c, X2nd_Funding_Received_Date2__c, Site_Audit_Amount__c, Non_GCU_Cash_Commission__c, GCU_Cash_Commission__c, Non_GCU_Cash_Commission_Paid__c, Non_GCU_Cash_Commission_Paid_Date__c, EC_Commission_Paid__c, EC_Commission_Paid_Date__c, PM2_hrs_Sunlight_Install_Complete_1_Paym__c, QC_System_Size_Financials__c, Override_Amount__c, Parent_Override__c, Parent_Account__c, Close_Taken_By__c, Welcome_Call_Complete__c, Welcome_Call_Complete_Date_Time__c, QC_Complete__c, QC_Completed_By__c, QC_Date_Time__c, Sharin_Pix_Token__c, Install_Scheduled_for_Today__c, Formula_to_Update_NonHorizon_Assigned_to__c, Solar_Company__c, Non_Horizon_Energy_Consultant__c, Energy_Consultant_Phone__c, HOA_Email__c, Loan_Docs_Signed__c, Pending_Cancellation__c, QC_System_Size_Financials_Date_Time__c, QC_performed_by__c, PM3_hrs_Sunlight_Install_Complete_1_Paym__c, Final_Design_QC_Complete__c, Final_Design_QC_Complete_Date__c, Pending_Cancellation_Date__c, System_Size__c, Substantial_Completion_Submitted__c, Substantial_Completion_Submit_Date_Time__c, PTO_Confirmed_with_Dividend__c, PTO_Confirmed_with_Dividend_Date_Time__c, PM2_hrs_Sunlight_PTO_Approved_2nd_Pay__c, Spotio_Status__c, Customer_Added_to_Installer_Portal__c, Permitting_List__c, Customer_Confirmed_Install_Date__c, Customer_Confirmed_Install_Date_on__c, Customer_Added_to_Installer_Portal_Date__c, QC_Close_Due__c, Add_Customer_to_Installer_Portal_Due__c, Design_Request_Due__c, Send_Design_to_Rep_Due__c, Final_Design_QC_Due__c, Fill_Out_System_Info_Due_Date__c, PM3_hrs_Sunlight_PTO_Approved_2nd_Pay__c, Substantial_Completion_Due__c, Permit_Pack_Received_Permit_Submitted__c, Docs_Sent_to_Installer_Due__c, Saved__c, Permit_Pack_Complete__c, Permit_Pack_Complete_Date_Time__c, Design_QC_Date_Time__c, Site_Audit_Due__c, Install_Complete_Due__c, Due__c, of_Days_Loan_Approved_to_Docs_Signed__c, Saved_Date__c, Origination_Fee__c, Energy_Efficiency_Pack__c, Manager_2_Override__c, Manager_3_Override__c, Manager_2_Override_Paid__c, Manager_3_Override_Paid__c, Manager_2_Override_Paid_Date__c, Manager_3_Override_Paid_Date__c, Energy_Efficiency_Package_Delivered__c, Monitoring_Notes__c, HVAC_Cost__c, Resubmission_Required__c, New_Roof__c, Concert_Denied__c, HVAC_Project__c, Service_Type_Requested__c, Service_Quote_Requested__c, Service_Quote_Received__c, Auxiliary_Service_Completed__c, Auxiliary_Service_Scheduled_Date__c, Service_Quote_Requested_Date_Time__c, Auxiliary_Service_Completed_Date_Time__c, Service_Quote_Received_Date_Time__c, Auxiliary_Service_Scheduled__c, Auxiliary_Service_Scheduled_Date_Time__c, Auxiliary_Service_Amount__c, Loan_Docs_Submitted__c, Generations_Approved__c, Saved_Notes__c, Application_Docs_Submitted__c, Generations_Denied__c, Application_Docs_Submitted_Date_Time__c, Loan_Approved_Date_Time__c, Loan_Denied_Date_Time__c, Loan_Docs_Signed_Date_Time__c, Awaiting_Loan_Doc_Signature__c, X2nd_Inspection_Failed__c, Energy_Efficiency_Package_Sent__c, EEP_Sent_Date__c, EEP_Delivered_Date__c, Energy_Efficiency_Pack_Delivered_Date__c, Need_EEP_Sent__c, EEP_Sent__c, Need_EEP_Delivered__c, Mosaic_Denied__c, X2nd_Inspection_Failed_Date__c, Concert_Approved__c, Mosaic_Approved__c, Concert_Approved_Date__c, Concert_Denied_Date__c, Customer_Survey_Sent__c, Customer_Survey_Sent_Date_Time__c, Customer_Survey_Complete__c, Customer_Survey_Complete_Date_Time__c, Need_to_Send_Customer_Survey__c, EEP_Notes__c, Aux_Service_Payment_Received__c, Aux_Service_Payment_Received_Date__c, X1st_Installer_Payment_Sent__c, X1st_Funding_Payment_Received_Date__c, X2nd_Installer_Payment_Sent__c, Mosaic_Approved_Date__c, Power_Guarantee_Date__c, of_days_Site_Audit_Scheduled__c, Adder_Amount__c, Contractor__c, X1st_Installer_Payment_Sent_Date__c, X2nd_Installer_Payment_Sent_Date__c, X1st_Installer_Payment_Amount__c, X2nd_Installer_Payment_Amount__c, Manager_3__c, Manager_2__c, Commission_Deductions__c, X1st_Funding_Payment_Received__c, X2nd_Funding_Payment_Received__c, Concession_Amount__c, Rep_Concession_Amount__c, Funding_Updates__c, Signing_Updates__c, Installer__c, X1st_Funding_Payment_Amount__c, X2nd_Funding_Payment_Amount__c, X1st_Funding_Payment_List__c, Expected_Pay_Date__c, EC_Commission__c, GCU_Cash_Amount__c, Non_GCU_Cash_Amount__c, Parent_Account_Override_Amount__c, Manager_2_Override_Amount__c, Manager_3_Override_Amount__c, Concession_Payment_Sent__c, Concession_Payment_Sent_Date__c, Site_Audit_Info_Needed__c, Mosaic_Denied_Date__c, SA_Stalled_Notes__c, FD_Stalled_Notes__c, COC_sent_to_GCU__c, Pending_Cancellation_Formula__c, COC_sent_to_GCU_Date__c, List_Add_Customer_to_Installer_Portal__c, PTO_Reimbursement_Needed__c, PTO_Reimbursement_Sent__c, PTO_Reimbursement_Amount__c, Field_Marketer1__c, Field_Marketer_Team__c, Commission_PPW__c, FM_Cost__c, Battery_Back_Up_Type__c, FM_Position__c, FM_Assist_Commission__c, Baseline_Cost_Per_Watt__c, Build_Cost_Per_Watt__c, Material_Cost__c, Equipment_Cost_Per_Watt__c, Gross_Revenue_Per_Watt__c, Material_Invoice_Paid__c, X1st_Installer_Payment_Date__c, Material_Invoice_Paid_Date_Time__c, EC_Team__c, of_Days_Pending_Cancellation__c, Service_Call__c, Finance_Failed__c, Install_Complete_No_PTO__c, Upgrade_Needed__c, Cancelation_Invoice_Sent__c, Cancelation_Invoice_Paid__c, Cancelation_Invoice_Sent_Date_Time__c, Cancelation_Invoice_Paid_Date_Time__c, Manager_4__c, Manager_4_Override_Amount__c, Manager_4_Override__c, Manager_4_Paid__c, Manager_4_Paid_Date__c, Install_of_Days__c, Finance_Approved_QC__c, Permit_Submitted_QC__c, Permit_Approved_QC__c, Upgrade_Needed_QC__c, GCU_COC_Signed__c, Sunlight_Approved__c, Sunlight_Denied__c, Loanpal_Approved__c, Loanpal_Denied__c, X2nd_Inspection_Failed_Notes__c, X3rd_Inspection_Failed__c, Failed_Engineering__c, three_days__c, Generations_Approved_Date__c, Generations_Denied_Date__c, LoanPal_Approved_Date__c, LoanPal_Denied_Date__c, Sunlight_Approved_Date__c, Sunlight_Denied_Date__c, Permit_Pack_Requested__c, Permit_Pack_Requested_Date__c, Cancelation_Fee__c, Install_Date_Prior_Value__c, Install_Rescheduled_Reason__c, of_Days_from_Close__c, Loan_Doc_Signing_Date__c, Loan_Doc_Expiry_Date__c, Loan_Docs_in_Signing_Que__c, X1st_Invoice_Sent_to_GCU__c, X1st_Invoice_Sent_to_GCU_Date__c, Stip_1__c, Stip_2__c, Stip_3__c, Stip_4__c, Stip_5__c, Days_until_Install__c, X1st_Commission_Amount__c, X2nd_Commission_Amount__c, X2nd_Commission_Due_Date__c, X1st_Commission_Due_Date__c, X1st_Commission_Paid__c, X1st_Commission_Paid_Date__c, X2nd_Commission_Paid__c, X2nd_Commission_Paid_Date__c, Hours_Install_Scheduled_Permit_Submit__c, Hours_Permit_Submitted_Approved__c, Hours_PermitPackReceived_ICX__c, Hours_Interconnection_Submitted_Approved__c, Hours_Install_Complete_Inspection_Sched__c, Hours_Inspection_Approved_PTO_Submitted__c, Hours_Install_Scheduled_Loan_Approved__c, Hours_Loan_Approved_Docs_Signed__c, Hours_Install_Scheduled_Loan_Docs_Signed__c, Hours_GCU_Cash_Install_Complete_2_Paym__c, Hours_Sunlight_PTO_Approved_2nd_Payment__c, X3rd_Inspection_Failed_Notes__c, Rough_Inspection_Passed__c, Rough_Inspection_Scheduled_Date__c, Rough_In_Inspection_Passed__c, X3rd_Inspection_Failed_Date_Time__c)
    @days = (params[:days] || 21).to_i
    # @appointments = Appointment.where("DATE(start_at) < ?", Date.today - @days)
    @proposals = Proposal.where("DATE(created_at) > ?", Date.today - @days)
    @users = User.where("Date(last_seen_at) < ?", Date.today - 3).count

    @backups = User.first.documents.last(12).reverse

    @sales_reps_with_issues = User.sales.active.where(canvass_user_id: [nil, ""])
  end

  def refresh_project_csv
    GenerateSfCsvJob.perform_later
    redirect_to analytics_path, notice: "File will be ready in about a minute or so. Click Download then."
  end

  def gitbook
  end

  private

  def set_session_referrer
    cookies[:pub] = params[:pub] if params[:pub].present?
    @referrer = Contact.find_by(secure_public_id: cookies[:pub]) if cookies[:pub].present?
  end
end
