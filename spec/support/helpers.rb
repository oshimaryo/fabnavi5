module Helpers
  def authenticate_user
    true #TODO
  end

  def token
    {
      "ADbJwXx1RgaqQ3m_WD9_mg" => {
        "token" => "$2a$10$Z4I..3utPJzQ4u7CfBF4F.W9h5AKr0.IOeP4LSSSim6J.fiAN7iCG",
        "expiry" => 3443245119,
        "last_token" => "$2a$10$8/jCT8SYxQTXb6VdlSD5buTSzP69xGrNx3U11INm7MjQrMNM5btHO",
        "updated_at"=>"2015-09-12T14:25:19.533+09:00"
      }
    }
  end

  def json_header
    {
      CONTENT_TYPE: 'application/json',
      ACCEPT: 'application/json'
    }
  end

  def binary_header
    {
      'CONTENT_TYPE' => 'multipart/form-data',
      'ACCEPT' => 'application/json'
    }
  end

  def set_auth_info user
    user.update! tokens: token
    request_header[:Uid] = "user0@example.com"
    request_header["Access-Token"] = "x9XcLOtpdQWDpa3tSmESjg"
    request_header[:Client] = "ADbJwXx1RgaqQ3m_WD9_mg"
  end

end

RSpec.configure do |config|
  config.include Helpers
end
