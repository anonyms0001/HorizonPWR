module FilterHelper
  def filterable(relation, column, title, options = {})
    # TODO: StandardRB says "Lint/UselessAssignment: Useless assignment to variable - `matching_column`."
    matching_column = column.to_s == filter_column(relation.klass)

    # link_to request.params.merge(filter: column, direction: direction), options do
    #   concat title
    #   if matching_column
    #     caret = filter_direction == "asc" ? "up" : "down"
    #     concat " "
    #     concat tag.i(nil, class: "fas fa-caret-#{caret}")
    #   end
    # end
  end
end
