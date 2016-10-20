class V1::Users < V1::Base
  include Grape::Kaminari

  resource :users do
    desc 'Update a user', {headers: AUTH_HEADERS}
    params do
      requires :user, type: Hash do
        requires :avatar, type: Rack::Multipart::UploadedFile
      end
    end
    patch jbuilder: 'v1/users/update' do
      authenticate_user!
      @user = current_user
      if @user.update avatar: params[:user][:avatar]
        status 200
      else
        status 400
      end
    end

    resource ':id' do
      desc 'Describe a user'
      get jbuilder: 'v1/users/show' do
        @user = User.find params[:id]
      end
    end

    resource ':id/projects' do
      desc 'Get all projects of a user'
      get jbuilder: 'v1/users/projects' do
        authenticate_user!
        query = Project.where(user_id: params[:id])
        if signed_in?
          query = query.showable_for current_user
        else
          query = query.public_projects
        end
        @projects = paginate query.order(id: :desc)
      end
    end
  end
end
