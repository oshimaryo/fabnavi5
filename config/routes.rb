Rails.application.routes.draw do
  root "home#show"
  mount_devise_token_auth_for 'User', at: 'auth'
  namespace :api do
    mount API => '/'
    if Rails.env.development?
      mount GrapeSwaggerRails::Engine => '/v1/swagger'
    end
  end
end
