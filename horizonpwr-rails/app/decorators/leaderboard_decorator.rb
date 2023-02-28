class LeaderboardDecorator < SimpleDelegator
  # NOTE: If a method will return more than one item (ie, a link), you must put the HTML in a Heredoc. Otherwise, only
  #       the last item will be returned!

  # NOTE: Prepend view helpers with `h.` and route helpers with `routes.`
  include ViewHelpers

  def personal
    content_block = if job_position_name == "Field Marketer"
      <<~HTML
        <dl class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <div class="flex flex-col rounded bg-blue-400 p-6 text-center my-3 md:mr-2 lg:mr-0 xl:mr-2">
            <dt class="order-2 mt-2 text-sm font-medium text-white">
              Leads
            </dt>
            <dd class="order-1 text-3xl font-extrabold text-white">
              #{current_user&.this_week_leads_count}
            </dd>
          </div>
          <div class="flex flex-col rounded bg-red-400 p-6 text-center my-3 md:mx-2 lg:mx-0 xl:mx-2">
            <dt class="order-2 mt-2 text-sm font-medium text-white">
              Quality Sits
            </dt>

            <dd class="order-1 text-3xl font-extrabold text-white">
              #{current_user&.this_week_created_by_quality_sits_count}
            </dd>
          </div>
          <div class="flex flex-col rounded bg-indigo-400 p-6 text-center my-3 md:ml-2 lg:ml-0 xl:ml-2">
            <dt class="order-2 mt-2 text-sm font-medium text-white">
              Assists
            </dt>
            <dd class="order-1 text-3xl font-extrabold text-white">
               #{current_user&.this_week_assists_count}
            </dd>
          </div>
        </dl>
      HTML
    else
      <<~HTML
        <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <div class="flex flex-col rounded bg-red-400 p-6 text-center my-3 md:mx-2 lg:mx-0 xl:mx-2">
            <dt class="order-2 mt-2 text-sm font-medium text-white">
              Quality Sits
            </dt>
            <dd class="order-1 text-3xl font-extrabold text-white">
              #{current_user&.this_week_scheduled_with_quality_sits_count}
            </dd>
          </div>
          <div class="flex flex-col rounded bg-indigo-400 p-6 text-center my-3 md:ml-2 lg:ml-0 xl:ml-2">
            <dt class="order-2 mt-2 text-sm font-medium text-white">
              Scheduled Installs
            </dt>
            <dd class="order-1 text-3xl font-extrabold text-white">
               #{current_user&.this_week_scheduled_installs_count}
            </dd>
          </div>
        </dl>
      HTML
    end
    content_block.html_safe
  end

  def team
    #  TODO: presenter/decorators issue
    #  refactor https://github.com/HorizonPWR2/horizonpwr-rails/pull/24#discussion_r814477790
    content_block = <<~HTML
      <dl class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <div class="flex flex-col rounded bg-blue-400 p-6 text-center my-3 md:mr-2 lg:mr-0 xl:mr-2">
          <dt class="order-2 mt-2 text-sm font-medium text-white">
            Leads
          </dt>
          <dd class="order-1 text-3xl font-extrabold text-white">
          <% stat = @performance_stats.find_all { |stat| stat.accountable == current_user.accounts.impersonal&.first }.first %>
            #{stat.lead_count}
          </dd>
        </div>
        <div class="flex flex-col rounded bg-red-400 p-6 text-center my-3 md:mx-2 lg:mx-0 xl:mx-2">
          <dt class="order-2 mt-2 text-sm font-medium text-white">
            Quality Sits
          </dt>

          <dd class="order-1 text-3xl font-extrabold text-white">
            #{stat.quality_sit_count}
          </dd>
        </div>
        <div class="flex flex-col rounded bg-indigo-400 p-6 text-center my-3 md:ml-2 lg:ml-0 xl:ml-2">
          <dt class="order-2 mt-2 text-sm font-medium text-white">
          Scheduled Installs
          </dt>
          <dd class="order-1 text-3xl font-extrabold text-white">
             #{stat.scheduled_install_count}
          </dd>
        </div>
      </dl>
    HTML
    content_block.html_safe
  end
end
