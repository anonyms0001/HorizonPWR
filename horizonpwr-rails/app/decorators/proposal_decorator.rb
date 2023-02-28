class ProposalDecorator < SimpleDelegator
  # NOTE: If a method will return more than one item (ie, a link), you must put the HTML in a Heredoc. Otherwise, only
  #       the last item will be returned!

  # NOTE: Prepend view helpers with `h.` and route helpers with `routes.`
  include ViewHelpers

  def incomplete_state_block
    # These are the shared Tailwind classes to make the links look like buttons.
    # tailwind_classes = "mt-3 mr-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-m font-medium
    #                     rounded border border-gray-300 hover:border-gray-700 hover:shadow-xl text-gray-700 bg-gray-100
    #                     hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
    #                     text-center justify-center w-45"
    # tailwind_classes = "text-base font-medium leading-normal text-indigo-700"

    content_block = if blocked
      <<~HTML
        <div class="rounded-md bg-red-50 p-2 flex-grow border border-red-700 my-2 w-full" style="width:100%;">
          <div class="inline-flex">
            <div class="flex-shrink-0">
              <!-- Heroicon name: x-circle -->
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3 flex">
              <h3 class="text-sm font-medium text-red-800 mr-2">
                #{blocked_on}:
              </h3>
              <p class="text-sm text-red-700">
                #{reason_incomplete}
              <br/>
                #{blocked_by&.name} - #{blocked_at.strftime("%B %e, %Y") if blocked_at.present?}
              </p>
            </div>
          </div>
        </div>
        <a href="#{routes.proposal_unblocked_path(self)}" data-disable-with="Please Wait..." style="margin-left: 0 !important;" class="flex-grow text-base font-medium leading-normal text-indigo-700 bg-indigo-100 px-6 py-3 shadow rounded-md">
          Un-Block Proposal
        </a>
      HTML
      # content_block.html_safe
    else
      <<~HTML
        <div class="flex-grow h-full px-6 py-3 bg-indigo-100 shadow rounded-md cursor-pointer">
          #{h.link_to "Start QC", routes.proposal_start_quality_path(self, anchor: "quality-control-title"), class: "relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500" unless quality_control_step.present?}
          <a href="#{routes.proposal_blocked_path(self)}" class="text-base font-medium leading-normal text-indigo-700">Block Proposal</a>
        </div>
      HTML
      # content_block.html_safe
    end
    content_block.html_safe
  end

  def completion_state_link_block
    # These are the shared Tailwind classes to make the links look like buttons.
    # tailwind_classes = "text-base font-medium leading-normal text-indigo-500"

    case completion_state
    when "new"
      content_block = <<~HTML
        <a href="#{routes.proposal_start_design_path(self, anchor: "state_actions")}" class="flex-grow text-base font-medium leading-normal text-white bg-indigo-500 px-6 py-3 shadow rounded-md hover:text-white">Start Drawing</a>
      HTML
      content_block.html_safe
    when "draw"
      content_block = <<~HTML.chomp
        <a href="#{routes.proposal_end_design_path(self)}", class="flex-grow text-base font-medium leading-normal text-white bg-indigo-500 px-6 py-3 shadow rounded-md hover:text-white">Ready for QC</a>
        <a href="#{routes.proposal_back_path(self)}", class="flex-grow text-base font-medium leading-normal text-indigo-700 bg-indigo-100 px-6 py-3 shadow rounded-md">UnStart Drawing</a>
      HTML
      content_block.html_safe
    when "pending aurora"
      content_block = <<~HTML
        <a href="#{routes.proposal_start_design_path(self, anchor: "state_actions")}" class="flex-grow text-base font-medium leading-normal text-white bg-indigo-500 px-6 py-3 shadow rounded-md hover:text-white">Start Drawing</a>
      HTML
      content_block.html_safe
    when "complete"
      content_block = <<~HTML.chomp
        <div class="p-5 flex-inline items-center w-full">
          <h3 class="text-center font-bold">Quality Check Complete, Good Job!</h3>
          <div class="p-3 flex w-full text-center justify-between space-x-3"> 
            <a href="#{routes.proposals_path(completion_state: "new")}" class="flex-grow text-base font-medium leading-normal text-white bg-indigo-500 px-6 py-3 shadow rounded-md">Proposal Board</a>
            <a href="#{routes.proposal_start_quality_path(self)}" class="flex-grow text-base font-medium leading-normal text-indigo-700 bg-indigo-100 px-6 py-3 shadow rounded-md">Restart Quality Check</a>
          </div>
        </div>
      HTML
      content_block.html_safe
    when "closed"
      content_block = <<~HTML.chomp
        <div class="p-5 flex-inline items-center w-full">
          <h3 class="text-center font-bold">Quality Check Complete, Good Job!</h3>
          <div class="p-3 flex w-full text-center justify-between space-x-3"> 
            <a href="#{routes.proposals_path(completion_state: "new")}" class="flex-grow text-base font-medium leading-normal text-white bg-indigo-500 px-6 py-3 shadow rounded-md">Proposal Board</a>
          </div>
        </div>
      HTML
      content_block.html_safe
    when "ready for close call"
      content_block = <<~HTML.chomp
        <div class="p-5 flex-inline items-center w-full">
          <h3 class="text-center font-bold">Quality Check Complete, Good Job!</h3>
          <div class="p-3 flex w-full text-center justify-between space-x-3"> 
            <a href="#{routes.proposals_path(completion_state: "new")}" class="flex-grow text-base font-medium leading-normal text-white bg-indigo-500 px-6 py-3 shadow rounded-md">Proposal Board</a>
            <a href="#{routes.proposal_start_quality_path(self)}" class="flex-grow text-base font-medium leading-normal text-indigo-700 bg-indigo-100 px-6 py-3 shadow rounded-md">Restart Quality Check</a>
          </div>
        </div>
      HTML
      content_block.html_safe
    end
  end

  def quality_control_step_block(index)
    # Case/when doesn't work with comparison operators (like == and >), apparently.
    content_block = if quality_control_step == 0
      <<~HTML
        <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-indigo-600 rounded-full mx-auto" aria-current="step">
          <span class="text-indigo-600">#{index + 1}</span>
        </span>
      HTML
    elsif quality_control_step == index + 1
      <<~HTML
        <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 bg-indigo-500 border-indigo-600 rounded-full mx-auto" aria-current="step">
          <span class="text-white">#{index + 1}</span>
        </span>
      HTML
    elsif quality_control_step > index + 1
      <<~HTML
        <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
           <!-- Heroicon name: solid/check -->
          <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </span>
      HTML
    else
      <<~HTML
        <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-indigo-600 rounded-full mx-auto" aria-current="step">
          <span class="text-indigo-600">#{index + 1}</span>
        </span>
      HTML
    end
    content_block.html_safe
  end
end
