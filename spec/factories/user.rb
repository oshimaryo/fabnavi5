FactoryBot.define do
  factory :user do
    provider "persona"
    email "user0@example.com"
    uid "user0@example.com"
    password "password"
    trait(:tokens) {
      trait(:ADbJwXx1RgaqQ3m_WD9_mg) {
        token "$2a$10$Z4I..3utPJzQ4u7CfBF4F.W9h5AKr0.IOeP4LSSSim6J.fiAN7iCG"
        expiry 3443245119
        last_token "$2a$10$8/jCT8SYxQTXb6VdlSD5buTSzP69xGrNx3U11INm7MjQrMNM5btHO"
        updated_at "2015-09-12T14:25:19.533+09:00"
      }
    }
    avatar { File.open(File.join(Rails.root, "app/assets/images/cloud.jpg")) }
  end
end
