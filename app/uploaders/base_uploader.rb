class BaseUploader < CarrierWave::Uploader::Base
  case Rails.env
  when "production", "staging"
    storage :fog
  else
    storage :file
  end

  def base_dir
    if Rails.env.production?
      "#{Rails.application.secrets.data_dir}/uploads"
    else
      "uploads"
    end
  end
end
