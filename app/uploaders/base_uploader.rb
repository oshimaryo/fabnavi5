class BaseUploader < CarrierWave::Uploader::Base
  storage (Rails.env.production? ? :fog : :file)

  def base_dir
    if Rails.env.production?
      "#{Rails.application.secrets.data_dir}/uploads"
    else
      "uploads"
    end
  end
end
