class V1 < Grape::API
  helpers do
    def authenticate_error!
      h = {'Access-Control-Allow-Origin' => "*",
           'Access-Control-Request-Method' => %w{GET POST OPTIONS}.join(",")}
      error!('Please signin first.', 401, h)
    end

    def authenticate_user!
      uid = request.headers['Uid']
      token = request.headers['Access-Token']
      client = request.headers['Client']
      @current_user = User.find_by_uid(uid)

      unless @current_user && @current_user.valid_token?(token, client)
        authenticate_error!
      end
    end

    def current_user
      @current_user
    end

    def signed_in?
      @current_user.present?
    end
  end
  mount V1::Projects
  mount V1::Calibrations
  mount V1::Attachments
  mount V1::Users
  mount V1::CurrentUser
  add_swagger_documentation(
    base_path: "/api/v1",
    hide_documentation_path: true
  )
end
