#https://github.com/carrierwaveuploader/carrierwave/wiki/How-to:-Use-test-factories#factorygirl
FactoryBot.define do
  factory :attachment do
    association :user, factory: :user
    type "Figure::Photo"
    file { Rack::Test::UploadedFile.new( Rails.root.join("app/assets/images/flower.jpg")) }
  end
end
