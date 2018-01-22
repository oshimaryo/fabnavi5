FactoryBot.define do
  factory :calibration do
    association :user, factory: :user
    name {"#{user.name}'s project"}
    x 10.0
    y 10.0
    width 10.0
    height 10.0
  end
end
