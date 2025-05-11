class BloodTestResult < ApplicationRecord
  belongs_to :patient
  belongs_to :blood_work_type

  validates :measured_value, presence: true, numericality: true
  validates :measured_unit, presence: true
  validates :measured_at, presence: true
end