class Patient < ApplicationRecord
  belongs_to :user
  has_many :doctor_patients
  has_many :doctors, through: :doctor_patients
  has_many :blood_test_results
  has_many :scheduled_blood_works

  validates :user_id, uniqueness: true

  def self.search_by_email(email)
    joins(:user).where("users.email LIKE ?", "%#{email}%")
  end

  def name
    user.name
  end

  def email
    user.email
  end

  def contact_number
    user.contact_number
  end
end
