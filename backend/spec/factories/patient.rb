FactoryBot.define do
  factory :patient do
    association :user
  end
end