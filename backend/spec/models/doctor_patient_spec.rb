require 'rails_helper'

RSpec.describe DoctorPatient, type: :model do
  let(:doctor) { create(:doctor) }
  let(:patient) { create(:patient) }

  it "is valid with valid attributes" do
    doctor_patient = DoctorPatient.new(doctor: doctor, patient: patient)
    expect(doctor_patient).to be_valid
  end

  it "is invalid without a doctor" do
    doctor_patient = DoctorPatient.new(doctor: nil, patient: patient)
    expect(doctor_patient).not_to be_valid
    expect(doctor_patient.errors[:doctor]).to include("must exist")
  end

  it "is invalid without a patient" do
    doctor_patient = DoctorPatient.new(doctor: doctor, patient: nil)
    expect(doctor_patient).not_to be_valid
    expect(doctor_patient.errors[:patient]).to include("must exist")
  end
end