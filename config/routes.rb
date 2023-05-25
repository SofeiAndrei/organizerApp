Rails.application.routes.draw do
  get 'password_resets/new'
  get 'password_resets/edit'
  root 'static_pages#home'
  get '/help', to: 'static_pages#help', as: 'helf'
  get '/signup', to: 'users#new'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :users do
    member do
      get :calendar
      get :my_teams
    end
    resources :user_todo_lists do
      resources :individual_tasks, only: %i[create update destroy]
    end
  end
  resources :account_activations, only: [:edit] # creeaza doar ruta account_activations/edit
  resources :password_resets, only: %i[new create edit update] # %i[array] -> array de simboluri
  resources :teams
  resources :team_memberships, only: %i[create destroy]
  resources :team_invitations, only: %i[create destroy]

  namespace :api, defaults: { format: :json } do
    resources :users do
      collection do
        get :search_users
      end
    end
    resources :user_todo_lists do
      resources :individual_tasks, only: %i[create update destroy]
      resources :individual_task_tags, only: %i[create destroy]
      member do
        get :get_tasks
      end
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end