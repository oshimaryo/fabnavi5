class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable

  include DeviseTokenAuth::Concerns::User

  mount_uploader :avatar, ImageUploader

  has_many :projects, dependent: :destroy
  has_many :attachments, dependent: :destroy
  has_many :calibrations, dependent: :destroy
end
