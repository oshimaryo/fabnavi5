class Content < ActiveRecord::Base
  include Attachable

  belongs_to :project
  has_many :figures, dependent: :destroy

  validates :type, presence: true

  accepts_nested_attributes_for :figures, allow_destroy: :true

  class << self
    def acceptable_attributes_for_create
      %i(id type)
    end
    def acceptable_attributes_for_update
      %i(id description attachment_id _destroy) + [figures_attributes: Figure.acceptable_attributes]
    end
  end
end
