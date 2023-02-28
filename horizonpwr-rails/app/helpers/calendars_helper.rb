module CalendarsHelper
  def params_from_url(query_string)
    joined_pairs = query_string.split("&")
    joined_pairs.map { |p| p.split("=") }
  end

  def params_in_url?(url, key, value)
    query_string = url.split("?")[1]
    return false if query_string.nil?
    params_from_url(query_string).include?([key, value.to_s.gsub(/\s/, "+")])
  end
end
