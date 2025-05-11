class BloodWorkType < ApplicationRecord
  has_many :blood_test_results, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :units, presence: true
end