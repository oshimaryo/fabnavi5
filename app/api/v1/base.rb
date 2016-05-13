class V1::Base < Grape::API
  AUTH_HEADERS = {
    "Client" => {
      required: false
    },
    "Access-Token" => {
      required: false
    },
    "Uid" => {
      required: false
    }
  }
end
