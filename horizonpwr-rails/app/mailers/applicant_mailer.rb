class ApplicantMailer < ApplicationMailer
  default from: "no_reply@panel.horizonpwr.com"

  def new_applicant
    @applicant = params[:applicant]
    @applicants_manager = params[:applicants_manager]
    @job_position = JobPosition.find(params[:applicant].job_position_id).name.downcase
    mail(
      from: "no_reply@panel.horizonpwr.com",
      # to: "#{@account_project_managers.pluck(:email).join(', ')}",
      to: email_address_with_name(@applicants_manager.email, @applicants_manager.name),
      subject: "New #{@job_position} application submitted"
    )
  end

  def onboard_applicant
    @applicant = params[:applicant]
    @applicant_name = @applicant.name
    @applicants_manager = params[:applicants_manager]
    @job_position = JobPosition.find(params[:applicant].job_position_id).name.downcase
    mail(
      from: "no_reply@panel.horizonpwr.com",
      # to: "#{@account_project_managers.pluck(:email).join(', ')}",
      to: email_address_with_name(@applicant.email, @applicant_name),
      subject: "Welcome to the HorizonPWR Team!"
    )
  end

  def invite
    @applicant = params[:applicant]
    @applicant_name = @applicant.name
    @job_position = JobPosition.find(params[:applicant].job_position_id).name.downcase
    mail(
      from: "no_reply@panel.horizonpwr.com",
      to: email_address_with_name(@applicant.email, @applicant_name),
      subject: "Application accepted for #{@job_position}"
    )
  end
end
