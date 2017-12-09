class V1::Projects < V1::Base
 include Grape::Kaminari
  helpers do
    def project_params_for_create
      ActionController::Parameters.new(params)
        .require(:project).permit *(Project.acceptable_attributes_for_create)
    end

    def project_params_for_update
      ActionController::Parameters.new(params)
        .require(:project).permit *(Project.acceptable_attributes_for_update)
    end
  end

  resource :projects do
    paginate per_page: 20

    desc 'Get all projects', {headers: AUTH_HEADERS}
    params do
      optional :q, type: String
    end
    get jbuilder: 'v1/projects/index' do
      query = Project.public_projects
      if params[:q].present?
        q = "%#{params[:q]}%"
        query = paginate query.eager_load(:user, {:taggings => :tag})
          .where("projects.name like ? or projects.description like ? or tags.name like ?" , q, q, q)
      end
      @projects = paginate query.order(id: :desc)
    end

    desc 'Create a project', {headers: AUTH_HEADERS}
    params do
      requires :project, type: Hash do
        requires :name, type: String
        requires :content_attributes, type: Hash do
          requires :type, type: String # ex) Content::PhotoList
        end
      end
    end
    post jbuilder: 'v1/projects/create' do
      authenticate_user!
      @project = current_user.projects.build project_params_for_create
      if @project.save
        status 201
      else
        status 400
      end
    end

    resource ':id' do
      desc 'Describe a project', {headers: AUTH_HEADERS}
      get jbuilder: 'v1/projects/show' do
        @project = if signed_in?
          Project.showable_for(current_user).find params[:id]
        else
          Project.public_projects.find params[:id]
        end
      end

      desc 'Update a project', {headers: AUTH_HEADERS}
      params do
        requires :project, type: Hash do
          optional :name, type: String
          optional :description, type: String
          optional :figure_id, type: Integer
          optional :tag_list, type: String
          optional :lisence_id, type: Integer
          optional :private, type: Boolean
          optional :content_attributes, type: Hash do
            optional :description, type: String
            optional :attachment_id, type: Integer
            optional :figures_attributes, type: Array do
              optional :id, type: Integer
              optional :type, type: String # ex) Figure::Photo
              optional :_destroy, type: Boolean
              optional :attachment_id, type: Integer
              optional :position, type: Integer
            end
          end
          optional :sensor_infos_attributes, type: Array do
            optional :id, type: Integer
            optional :data, type: Rack::Multipart::UploadedFile
            optional :_destroy, type: Boolean
          end
        end
      end
      patch jbuilder: 'v1/projects/update' do
        authenticate_user!
        @project = current_user.projects.find params[:id]
        if params[:project][:content_attributes]
          params[:project][:content_attributes][:id] = @project.content.id
        end

        if params[:project][:sensor_infos_attributes]
          unless @project.sensor_infos.find_by(id: params[:project][:sensor_infos_attributes][0][:id])
            sensor_info = @project.sensor_infos.build
            sensor_info.data = params[:project][:sensor_infos_attributes][0][:data]
            params[:project][:sensor_infos_attributes] = nil 
          end
        end

        if @project.update project_params_for_update
          status 200
        else
          status 400
        end
      end

      desc 'Delete a project', {headers: AUTH_HEADERS}
      delete do
        authenticate_user!
        proj = current_user.projects.find params[:id]
        proj.destroy
        body false
      end

      desc 'Like a project', {headers: AUTH_HEADERS}
      patch 'like' do
        authenticate_user!
        proj = current_user.projects.find params[:id]
        proj.liked_by current_user
        body false
      end

      desc 'Unlike a project', {headers: AUTH_HEADERS}
      patch 'unlike' do
        authenticate_user!
        proj = current_user.projects.find params[:id]
        proj.unliked_by current_user
        body false
      end
    end

    resource ':project_id' do
      resource 'content' do
        resource 'figures' do
          resource ':id' do
            desc 'Like a figure', {headers: AUTH_HEADERS}
            patch 'like' do
              authenticate_user!
              proj = current_user.projects.find params[:project_id]
              figure = proj.content.figures.find params[:id]
              figure.liked_by current_user
              body false
            end

            desc 'Unlike a figure', {headers: AUTH_HEADERS}
            patch 'unlike' do
              authenticate_user!
              proj = current_user.projects.find params[:project_id]
              figure = proj.content.figures.find params[:id]
              figure.unliked_by current_user
              body false
            end
          end
        end
      end
    end
  end
end
