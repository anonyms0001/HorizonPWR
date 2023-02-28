# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  resources :referrals
  resources :incoming_webhooks
  resources :calendar_notes
  get "/calendar_feed/:id", to: "calendars#feed", as: "calendar_feed"
  resources :applicants, only: [:new, :create]
  resources :careers, only: [:index, :show]
  post "canvass/note"
  post "canvass/appointment"
  post "canvass/interaction"
  draw :turbo
  # Jumpstart views
  if Rails.env.development? || Rails.env.test?
    mount Jumpstart::Engine, at: "/jumpstart"
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end

  # Administrate
  authenticated :user, lambda { |u| u.admin? } do
    namespace :admin do
      if defined?(Sidekiq)
        require "sidekiq/web"
        require "sidekiq/cron/web"
        mount Sidekiq::Web => "/sidekiq"
      end

      resources :announcements
      resources :users
      namespace :user do
        # resources :connected_accounts
      end
      resources :accounts
      resources :account_users
      # resources :plans
      # namespace :pay do
      #   resources :charges
      #   resources :subscriptions
      # end

      root to: "dashboard#show"
    end
  end
  # API routes
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      resource :auth
      resource :me, controller: :me
      resource :password
      resources :accounts
      resources :users
      resources :uploads
      resources :notification_tokens, only: :create
    end
  end

  # User account
  devise_for :users,
    controllers: {
      masquerades: "jumpstart/masquerades",
      omniauth_callbacks: "users/omniauth_callbacks",
      registrations: "users/registrations",
      sessions: "users/sessions"
    }
  devise_scope :user do
    get "session/otp", to: "sessions#otp"
  end

  resources :announcements, only: [:index]
  resources :api_tokens
  resources :accounts, except: :destroy do
    member do
      patch :switch
    end

    resource :transfer, module: :accounts
    resources :account_users, path: :members do
      get :deactivate
    end
    resources :account_invitations, path: :invitations, module: :accounts
  end
  resources :account_invitations

  # Payments
  resource :card
  resource :subscription do
    patch :info
    patch :pause
    patch :resume
  end
  resources :charges

  namespace :account do
    resource :password
  end
  resources :notifications, only: [:index, :show]
  get :mark_non_feedback_notifications_as_read, controller: :notifications
  namespace :users do
    resources :mentions, only: [:index]
  end
  namespace :user, module: :users do
    resource :two_factor, controller: :two_factor do
      get :backup_codes
      get :verify
    end
    resources :connected_accounts
  end

  namespace :action_text do
    resources :embeds, only: [:create], constraints: {id: /[^\/]+/} do
      collection do
        get :patterns
      end
    end
  end

  scope controller: :static do
    get :about
    get :analytics
    get :refresh_project_csv
    get :code_snippets
    get :terms
    get :contest
    get :podcast
    get :leaderboard
    get :installers_leaderboard
    get :onboarding
    get :privacy
    get :pricing
    get :roadmap
    get :gitbook
  end

  post :sudo, to: "users/sudo#create"

  match "/404", via: :all, to: "errors#not_found"
  match "/500", via: :all, to: "errors#internal_server_error"

  authenticated :user do
    root to: "static#leaderboard", as: :user_root
  end

  authenticate :user do
    get "/edit_attachments", to: "attachments#index"
    delete "/remove_attachment", to: "attachments#destroy"
    resources :calendars
    resources :concessions
    # resources :contests # Fix `rails test test/controllers/contests_controller_test.rb` before taking this live.
    resources :fundings, only: [:index]
    post "/add_to_aurora", to: "aurora#add_to_aurora"
    post "/deactivate_aurora", to: "aurora#deactivate_aurora"
    post "/reactivate_aurora", to: "aurora#reactivate_aurora"
    post "/add_to_canvass", to: "canvass#add_to_canvass"
    post "/deactivate_canvass", to: "canvass#deactivate_canvass"
    post "/reactivate_canvass", to: "canvass#reactivate_canvass"
    post "/onboard_user", to: "users#onboard_user"
    post "/subscribe_to_note", to: "notes#subscribe_to_note"
    post "/unsubscribe_from_note", to: "notes#unsubscribe_from_note"
    post "/update_task_completion", to: "appointments#update_task_completion"
    post "/appointment_failed", to: "appointments#mark_failed"

    resources :applicants do
      get :invite
    end
    resources :departments
    resources :note_tags, only: [:create]
    post "delete_tag", to: "note_tags#destroy"
    resources :notes
    resources :events
    resources :earning_rates, except: [:destroy, :new]
    get "/earnings/new", to: "errors#not_found"
    resources :earnings, except: [:new, :create, :destroy] do
      resources :adjustments
    end
    resources :payout_rate_variants, except: [:destroy, :new]
    resources :adjustments
    resources :payouts, except: :destroy
    resources :earning_types, except: :destroy
    resources :upline_relations
    resources :finance_partners
    resources :feedbacks do
      get :vote
      get :create_tracker_story
    end
    resources :field_responses, except: [:new]
    resources :form_responses, except: [:new]
    resources :dynamic_forms
    resources :field_configs
    resources :form_configs
    resources :user_filters, except: [:show, :index, :edit]
    resources :users do
      get "/onboarding_complete", to: "users#onboarding_complete"
      resources :documents
      resources :pending_job_positions
    end
    # TODO: `except: :destroy` isn't quite working the way we expect it to.
    resources :teams, except: :destroy, controller: "accounts", as: "teams"
    resources :proposals do
      resources :attachment_tags
      resources :energy_consumptions, except: [:index, :show]
      get :blocked
      get :unblocked
      get :back
      get :start_design
      get :end_design
      get :start_quality
      get :unstart_quality
      get :quality_progress
      post :quality_progress
      post :quality_previous
      get :end_quality
      get :create_aurora_project, controller: :aurora
      get :request_aurora_3dms, controller: :aurora
      get :validate_project
    end
    resources :contact_addresses
    resources :contact_appointments
    resources :projects do
      get :link_salesforce
      resources :concessions
      resources :attachment_tags
      resources :fundings do
        resources :funding_payments, except: [:show]
      end
    end
    resources :job_positions, except: :destroy
    resources :installers
    resources :addresses
    resources :appointments, except: :new do
      put "appointment_held", to: "appointments#update_held"
      get :selected_appointment
    end
    resources :contacts
    post "invite_installer", to: "installer_invites#toggle"
    post "reply_to_note", to: "note_replies#create"
    # root to: "dashboard#show", as: :user_root
    # Alternate route to use if logged in users should still see public root
    # get "/dashboard", to: "dashboard#show", as: :user_root
  end

  # Public marketing homepage
  devise_scope :user do
    root to: "devise/sessions#new"
  end
end
