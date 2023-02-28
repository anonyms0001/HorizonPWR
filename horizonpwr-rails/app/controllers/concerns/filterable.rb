module Filterable
  extend ActiveSupport::Concern

  included do
    helper_method :filter_column
  end

  private

  def filter_column(klass, column)
    klass.filterable_columns.include?(column)
  end

  def asdf(relation)
  end

  # request_filter_parameters.keys
  # request_filter_parameters.keys.each do |key|
  #   puts Appointment.filterable_columns.include?(key)
  # end

  def request_filter_parameters(klass)
    request_filter_parameters.select do |key, value|
      (request_filter_parameters.keys & klass.filterable_columns).include?(key)
    end
  end

  # request_filter_parameters = {"appointment_type"=>["site audit", "roof install"], "installer"=>["boise", "bend"]}
  # appt_key = "appointment_type"
  # request_filter_parameters[appt_key]
  #
  # where("#{appt_key}": request_filter_parameters[appt_key])
end
