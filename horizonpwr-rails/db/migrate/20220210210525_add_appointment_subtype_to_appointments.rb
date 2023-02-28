class AddAppointmentSubtypeToAppointments < ActiveRecord::Migration[6.1]
  def up
    add_column :appointments, :appointment_subtype, :string, if_not_exists: true
    # Only add the column if the column does not already exist since we do not drop the column in a rollback
    Appointment.where(appointment_type: "inspection").update_all(appointment_type: "final inspection", appointment_subtype: "building")

    roof_installs = Appointment.where(appointment_type: "roof install")
    roof_projects = roof_installs.map(&:project)
    ground_installs = Appointment.where(appointment_type: "ground install")
    ground_projects = ground_installs.map(&:project)

    Project.all.each do |project|
      project.update(install_types:
                       {roof_mount: roof_projects.include?(project),
                        ground_mount: ground_projects.include?(project),
                        battery_backup: project.battery})
    end
    roof_installs.update_all(appointment_type: "paneling install", appointment_subtype: "building")
    ground_installs.update_all(appointment_type: "paneling install", appointment_subtype: "building")

    Appointment.where(appointment_type: "ground install").update_all(appointment_type: "racking install", appointment_subtype: "building")
    safety_assured { remove_column :projects, :battery }
  end

  def down
    add_column :projects, :battery, :boolean
    Project.all.each do |project|
      project.update(battery: project.battery_backup)
    end

    Appointment.where(appointment_type: "paneling install").each do |appointment|
      if appointment.project.present?
        if appointment.project.roof_mount?
          appointment.update(appointment_type: "roof install")
        elsif appointment.project.ground_mount?
          appointment.update(appointment_type: "ground install")
        end
      end
    end

    Appointment.where(appointment_type: "final inspection").update_all(appointment_type: "inspection")

    # remove_column :appointments, :appointment_subtype
    # Intentionally not allowing the column to dropped to avoid corrupting data
  end
end
