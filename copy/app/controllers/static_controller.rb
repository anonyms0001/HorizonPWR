class StaticController < ApplicationController
  before_action :authenticate_user!, only: [:leaderboard, :onboarding]

  def index
  end

  def leaderboard
    @chart_data = {
      datasets: [{
        label: "My First dataset",
        backgroundColor: ["orange", "#e6e6e4"],
        borderColor: "#ffffff",
        data: [50, 50]
      }]
    }

    @chart_options = {
      responsive: true,
      hover: {
        mode: nil
      },
      tooltips: {
        enabled: false
      },
      plugins: {
        legend: {
          display: false,
          position: "top"
        },
        title: {
          display: true,
          text: "Chart.js Doughnut Chart"
        }
      }
    }
    redirect_to onboarding_path unless current_user.active
    @pagy, @teams = pagy(Account.impersonal.where(active: true).order(name: :asc))
    @pagy, @reps = pagy(User.where(active: true).includes(:accounts).with_attached_avatar)
    @pagy, @reps = pagy(@teams.first.account_users.map(&:user)) if @teams.count == 1
  end

  def onboarding
    # TODO: Onboarding https://gorails.com/episodes/user-onboarding-progress-bar
    @dynamic_form = DynamicForm.find_by(use_case: "onboarding")
    redirect_to leaderboard_path unless !current_user.active
  end

  def code_snippets
    @user = User.first
  end

  def about
  end

  def roadmap
    @planned_feedbacks = Feedback.where(status: "planned")
    @progressing_feedbacks = Feedback.where(status: "in_progress")
    @completed_feedbacks = Feedback.where(status: "completed")
  end

  def pricing
    redirect_to root_path, alert: t(".no_plans") unless Plan.without_free.exists?
  end

  def terms
  end

  def privacy
  end
end
