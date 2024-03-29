Rails.application.routes.draw do
  get 'password_resets/new'
  get 'password_resets/edit'
  root 'static_pages#home'
  get '/signup', to: 'users#new'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  patch '/calendar_event_invitations/:calendar_event_id/:user_id/:answer', to: 'calendar_event_invitations#update'

  resources :users do
    member do
      get :calendar
      get :my_teams
      get :friend_list
      get :common_friends
    end
    resources :user_todo_lists do
      resources :individual_tasks, only: %i[create update destroy]
    end
  end
  resources :account_activations, only: [:edit] # creeaza doar ruta account_activations/edit
  resources :password_resets, only: %i[new create edit update] # %i[array] -> array de simboluri
  resources :teams do
    resources :team_projects do
      resources :team_project_tasks, only: %i[create update destroy]
    end
    member do
      get :calendar
    end
  end
  resources :team_memberships, only: %i[create destroy update] do
    member do
      patch :promote
      patch :demote
    end
  end
  resources :team_invitations, only: %i[create destroy] do
    member do
      delete :accept
      delete :reject
    end
  end

  resources :friendship_requests, only: %i[create destroy] do
    member do
      delete :accept
      delete :reject
    end
  end
  resources :friendships, only: %i[destroy]
  resources :calendar_event_invitations, only: [:destroy]

  namespace :api, defaults: { format: :json } do
    resources :users do
      collection do
        get :search_users
      end
      member do
        get :calendar_filtered_events
      end
    end
    resources :user_todo_lists do
      resources :individual_tasks, only: %i[create update destroy]
      resources :individual_task_tags, only: %i[create destroy]
      member do
        get :get_tasks
      end
    end
    resources :team_projects do
      member do
        get :get_project_tasks
      end
    end
    resources :teams do
      member do
        get :calendar_filtered_events
      end
    end
    resources :calendar_events
    resources :task_comments, only: %i[create destroy] do
      collection do
        get '/:task_id', to: 'task_comments#comments_for_task'
      end
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end