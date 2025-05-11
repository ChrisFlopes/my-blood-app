class DoctorPatient < ApplicationRecord
  belongs_to :doctor
  belongs_to :patient

  validates :doctor_id, presence: true
  validates :patient_id, presence: true
end