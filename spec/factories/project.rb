FactoryBot.define do
  factory :project do
    association :user, factory: :user
    name {"#{SecureRandom.hex(16)}"}
    private false
    description {"#{SecureRandom.hex(32)}"}
    association :lisence, factory: :lisence
    association :content, factory: :content
    tag_list "tag1 tag2 tag3 tag4 tag5"
  end
end
