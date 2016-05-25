class V1::CurrentUser < V1::Base
  resource :current_user do
    desc 'Describe the current user', {headers: AUTH_HEADERS}
    get jbuilder: 'v1/current_user/show' do
      authenticate_user!
      @user = current_user
    end
  end
end
