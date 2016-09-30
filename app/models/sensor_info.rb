class SensorInfo < ActiveRecord::Base
  belongs_to :project
  mount_uploader :data, FileUploader

  class << self
    def acceptable_attributes
      %i(id data _destroy)
    end
  end
end
