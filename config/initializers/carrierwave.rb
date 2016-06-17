sc = Rails.application.secrets
CarrierWave.configure do |config|
  case Rails.env
  when "production", "staging"
    config.fog_credentials = {
      provider:              'AWS',                        # required
      aws_access_key_id:     sc.aws_access_key_id,     # required
      aws_secret_access_key: sc.aws_secret_access_key, # required
      region:                'ap-northeast-1',                  # optional, defaults to 'us-east-1'
      # host:                  's3.example.com',             # optional, defaults to nil
      # endpoint:              'https://s3.example.com:8080' # optional, defaults to nil
    }
    config.fog_directory  = sc.bucket                      # required
    config.fog_public     = true                           # optional, defaults to true
    config.fog_attributes = { 'Cache-Control' => "max-age=#{365.day.to_i}" } # optional, defaults to {}
  end
end
