class CreateEarningJob < ApplicationJob
  queue_as :default

  def perform(args)
    Honeybadger.context({args: args})
    # TODO: This Job is strictly only for if/when a project is created.
    # Earnings sometimes get created without a project. ie: "sit not sold"
    project = Project.find(args[:project_id])
    field_marketer = project.appointments.find_by(appointment_type: "consult").created_by
    energy_consultant = project.appointments.find_by(appointment_type: "consult").scheduled_with
    # address = project.address

    ActiveRecord::Base.transaction do
      # fm
      if field_marketer.present? && (field_marketer != energy_consultant)
        # Earning.create_quality_sit!(field_marketer, address, project)
        # FM 'frontend' earnings are handled when the EC marks the appointment as held
        # Not when there is a close
        # Earning.create_earning!("backend", field_marketer, address, project)
        # Earning.create!(appointment: Appointment.first, user: User.find(997), earning_type: 'backend')
        Earning.create!(project: project, user: field_marketer, earning_type: "backend")
        # Earning.create!(project: project, user: field_marketer, earning_type: 'bonus')
      end

      case energy_consultant.job_position_name
        # when "Field Marketer"
      when "Energy Consultant"
        # EC front end
        # Earning.create_earning!("frontend", energy_consultant, address, project)
        Earning.create!(project: project, user: energy_consultant, earning_type: "frontend")
        # EC back end
        # kWh = project&.system_size || 1
        # earning_type = EarningType.find_by(job_position_id: energy_consultant.job_position_id, name: 'backend', preferred_financial_option: true )
        # Earning.create!(address: address, user: energy_consultant, earning_type: earning_type, unit: kWh)
        # Earning.create_earning!("backend", energy_consultant, address, project)
        Earning.create!(project: project, user: energy_consultant, earning_type: "backend")
        # bonus earning ec
        # Earning.create_earning!("bonus", energy_consultant, address, project)
        Earning.create!(project: project, user: energy_consultant, earning_type: "bonus")

        manager = AccountUser.account_default_manager(project.consult.account)
        # m override
        # Earning.create_earning!("override", manager, address, project)
        Earning.create!(project: project, user: manager, earning_type: "override")

        # rm upline
        # Earning.create_earning!("upline", manager.upline, address, project) if manager.upline.present?
        Earning.create!(project: project, user: manager.upline, earning_type: "upline1") if manager.upline.present?

        # rm2 upline
        # Earning.create_earning!("upline", manager.upline.upline, address, project) if manager.upline.present? && manager.upline&.upline&.present?
        Earning.create!(project: project, user: manager.upline.upline, earning_type: "upline2") if manager.upline.present? && manager.upline&.upline&.present?
      when "Sales Manager"
        # m frontend
        # Earning.create_earning!("frontend", energy_consultant, address, project)
        Earning.create!(project: project, user: energy_consultant, earning_type: "frontend")
        # m backend
        # Earning.create_earning!("backend", energy_consultant, address, project)
        Earning.create!(project: project, user: energy_consultant, earning_type: "backend")
        # m bonus
        Earning.create!(project: project, user: energy_consultant, earning_type: "bonus")
        # rm upline
        # Earning.create_earning!("upline", energy_consultant.upline, address, project) if energy_consultant.upline.present?
        Earning.create!(project: project, user: energy_consultant.upline, earning_type: "upline1") if energy_consultant.upline.present?
        # rm2 upline
        # Earning.create_earning!("upline", energy_consultant.upline&.upline, address, project) if energy_consultant.upline.present? && energy_consultant.upline&.upline&.present?
        Earning.create!(project: project, user: energy_consultant.upline&.upline, earning_type: "upline2") if energy_consultant.upline.present? && energy_consultant.upline&.upline&.present?
      when "Regional Manager"
        # rm frontend
        # Earning.create_earning!("frontend", energy_consultant, address, project)
        Earning.create!(project: project, user: energy_consultant, earning_type: "frontend")
        # rm backend
        # Earning.create_earning!("backend", energy_consultant, address, project)
        Earning.create!(project: project, user: energy_consultant, earning_type: "backend")
        # rm2 upline
        # Earning.create_earning!("upline", energy_consultant.upline, address, project) if energy_consultant.upline.present?
        Earning.create!(project: project, user: energy_consultant, earning_type: "upline1") if energy_consultant.upline.present?
      end
    end
  end
end
