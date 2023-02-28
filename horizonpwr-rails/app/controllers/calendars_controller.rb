class CalendarsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :feed
  before_action :authenticate_user!, except: :feed
  before_action :set_user
  before_action :set_view_as_user, only: :index
  before_action :set_appointments

  def index
    @filters = request_filter_parameters.present? ? request_filter_parameters : false

    start_date = params[:start_date]&.to_date || Date.today

    @appts = @appointments unless params[:q].present?
    @appts = @appointments.search_by_params(params[:q]) if params[:q].present?

    @appt_details = params[:appt_details_for].present? ? Appointment.find(params[:appt_details_for]) : Appointment.none
    @active_users = User.active.order(first_name: :asc)
    authorize! @active_users, to: :view?, with: CalendarViewPolicy if @view_as_user.present?

    @calendar_partial = params[:calendar_view].present? ? params[:calendar_view] : "month"
    @day_note = params[:calendar_view].present? && params[:calendar_view] == "day" ? CalendarNote.where(date: start_date.beginning_of_day..start_date.end_of_day) : nil

    @header_notes = CalendarNote.where(global: true)

    @appointment_types = Appointment.appointment_types_by_job_position(current_user.job_position.name).map { |i| [i.titleize, i] }
    @appointment_subtypes = Appointment.appointment_subtypes.map { |i| [i.titleize, i] }
    @installers = Installer.active.order(name: :asc).map { |i| [i.name, i.id] }
    @teams = Account.active.where(personal: false, installer_id: nil).order(name: :asc).map { |i| [i.name, i.id] }

    @users = User.active.where("extract(month  from birth_date) = ?", start_date.month).none

    @user_filters = current_user.user_filters.order(name: :asc)
    @new_note = @appt_details.present? ? Note.new(notable: @appt_details) : nil
  end

  def feed
    respond_to do |format|
      format.ics do
        cal = Icalendar::Calendar.new
        cal.x_wr_calname = "Horizon PWR"
        tzid = "UTC"

        @appointments.each do |appointment|
          cal.event do |e|
            e.uid = appointment.id.to_s

            e.dtstart = Icalendar::Values::DateTime.new appointment.start_at_utc, "tzid" => tzid
            e.dtend = Icalendar::Values::DateTime.new appointment.end_at_utc, "tzid" => tzid
            e.location = appointment.address.address
            e.status = appointment.appointment_status
            e.summary = appointment.feed_summary # NOTE: e.summary is the event title
            e.created = appointment.created_at
            e.contact = appointment.address.contacts.map(&:first_name)
            e.description = appointment.description
            e.url = appointment_url(appointment).to_s
            # e.attach
            # e.geo
            # e.organizer
            # e.priority
          end
        end
        cal.publish
        render plain: cal.to_ical
      end
    end
  end

  private

  def set_user
    @user = if params[:id].present?
      User.find_by(secure_public_id: params[:id])
    else
      current_user
    end
  end

  def set_appointments
    # TODO: I don't think this is actually scoped to the view_as_user, yet.
    @policy = AppointmentPolicy.new(user: @user)
    @appointments = @policy.apply_scope(Appointment.includes(:address, :contacts, :account, :project).where("appointments.created_at > ?", @user.start_date), type: :relation)

    if request_filter_parameters.present?
      request_filter_parameters.each do |key, value|
        if key == "appointment_type"
          @appointments = @appointments.where(key => value)
        elsif key == "installer_id"
          @appointments = @appointments.where(project: {installer_id: value})
        elsif key == "account_id"
          @appointments = @appointments.where(account: {id: value})
        end
      end
    end
  end

  def set_view_as_user
    @view_as_user = params[:view_as_user].present? ? params[:view_as_user] : current_user.id
  end
end
