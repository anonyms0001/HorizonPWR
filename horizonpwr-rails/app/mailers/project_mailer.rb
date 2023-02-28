class ProjectMailer < ApplicationMailer
  default from: "no_reply@panel.horizonpwr.com"

  def completed_email
    @project = params[:proj]
    @account = @project.appointments.last.account
    # @account_project_managers = @account.account_users.project_managers.map {|a| a.user}
    @account_project_manager = params[:pm_user]
    @contact = @project.address.contacts.first

    mail(
      from: "no_reply@panel.horizonpwr.com",
      # to: "#{@account_project_managers.pluck(:email).join(', ')}",
      to: email_address_with_name(@account_project_manager.email, @account_project_manager.name),
      subject: "Project Completed: #{@contact.first_name} #{@contact.last_name}"
    )
  end
end
