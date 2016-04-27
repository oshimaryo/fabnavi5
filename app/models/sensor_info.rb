class SensorInfo < ActiveRecord::Base
  belongs_to :project

  class << self
    def acceptable_attributes
      %i(id data _destroy)
    end
  end
end
