namespace :generate do
  desc "Automatically generate payouts for reps for future weeks if one is not already created for that rep"
  task future_payouts: :environment do
    User.active.sales.each do |user|
      pay_date = (Date.today.end_of_week - 2.days) + 2.weeks # -2.days because thursdays
      Payout.find_or_create_by!(user: user, pay_date: pay_date)
    end
  end

  desc "activate the canvass user in staging and review"
  task activate_canvass_user: :environment do
    User.find_by(email: "canvass@horizonpwr.com").update(active: true)
  end

  desc "add missing created_by_postion_id's on consult appointments"
  task appointment_created_by_position_ids: :environment do
    # TODO: refactor to a better sql query
    # Proposal.update_all("address_id = appointments.address_id FROM appointments WHERE appointment_id = appointments.id")
    # appointments = Appointment.where(appointment_type: 'consult', created_by_position_id: nil)
    # appointments.update_all("created_by_position_id = created_by.job_position.id FROM users WHERE created_by_id = created_by.id")
    # Appointment.update_all("created_by_position_id = created_by.job_position.id FROM users WHERE created_by_id = created_by.id")

    Appointment.where(appointment_type: "consult", created_by_position_id: nil).each do |appointment|
      appointment.update(created_by_position_id: appointment.created_by&.job_position&.id)
    end
  end

  task prepare_pending_payouts: :environment do
    # if accrued
  end
end
