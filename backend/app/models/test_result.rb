class TestResult < ApplicationRecord
  belongs_to :blood_work_type
  belongs_to :patient

  validates :measured_value, presence: true
  validates :measured_at, presence: true
  validates :blood_work_type_id, presence: true
  validates :patient_id, presence: true
end