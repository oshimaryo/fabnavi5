Rails.application.routes.draw do
  root "home#show"
  get "myprojects", to: "home#show"
  get "create", to: "home#show"
  get "edit/*id", to: "home#show"
  get "detail/*id", to: "home#show"
  get "play/*id", to: "home#show"
  mount_devise_token_auth_for 'User', at: 'auth'
  namespace :api do
    mount API => '/'
    # if Rails.env.development?
      mount GrapeSwaggerRails::Engine => '/v1/swagger'
    # end
  end
end
