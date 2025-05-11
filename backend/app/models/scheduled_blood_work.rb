class ScheduledBloodWork < ApplicationRecord
  belongs_to :patient
  belongs_to :blood_work_type

  validates :patient_id, presence: true
  validates :appointment_time, presence: true
  validates :blood_work_type_id, presence: true
  validates :approved, inclusion: { in: [true, false] }
  validates :rejected, inclusion: { in: [true, false] }
  validates :cancelled, inclusion: { in: [true, false] }

  validate :cannot_approve_and_reject_together

  scope :approved, -> { where(approved: true) }
  scope :rejected, -> { where(rejected: true) }
  scope :cancelled, -> { where(cancelled: true) }
  scope :open_requests, -> { where(approved: false, rejected: false, cancelled: false) }

  def patient_name
    patient.name
  end

  def blood_work_type_name
    blood_work_type.name
  end

  private

  def cannot_approve_and_reject_together
    if approved && rejected
      errors.add(:base, "Cannot approve and reject a scheduled blood work at the same time")
    end
  end
end