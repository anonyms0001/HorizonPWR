module AppointmentsHelper
  def time_by_appointment_type(appointment)
    if Appointment.inspection_types.include?(appointment.appointment_type)
      "All Day"
    else
      local_time(appointment.start_at, format: "%l:%M %p")
    end
  end

  def datetime_by_appointment_type(appointment)
    if Appointment.inspection_types.include?(appointment.appointment_type)
      "#{local_time(appointment.start_at, format: "%b %e, %Y")}, All Day"
    else
      local_time(appointment.start_at, format: "%b %e, %Y, %l:%M%P")
    end
  end
end
