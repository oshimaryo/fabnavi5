class V1::ProjectsAPI < V1::BaseAPI
  helpers do
    def project_params
      ActionController::Parameters.new(params)
        .require(:project).permit *(Project.acceptable_attributes)
    end
  end

  resource :projects do
    get do
      Project.order(id: :desc).page(params[:page])
    end

    params do
      requires :project, type: Hash do
        requires :name, type: String
        requires :description, type: String
      end
    end

    post do
      authenticate_user!
      proj = Project.create project_params
      proj.to_json
    end

    resource ':id' do
      patch do
        proj = Project.find(params[:id])
        proj.update project_params
        proj.to_json
      end

      delete do
        proj = Project.find(params[:id])
        proj.destroy
        {}
      end

      patch 'like' do
        authenticate_user!
        proj = Project.find(params[:id])
        proj.liked_by current_user
        {}
      end

      patch 'unlike' do
        authenticate_user!
        proj = Project.find(params[:id])
        proj.unliked_by current_user
        {}
      end
    end
  end
end
