require 'rails_helper'

RSpec.describe ScheduledBloodWork, type: :model do
  let(:patient) { create(:patient) }
  let(:blood_work_type) { create(:blood_work_type) }

  it "is valid with valid attributes" do
    scheduled_blood_work = ScheduledBloodWork.new(
      patient: patient,
      blood_work_type: blood_work_type,
      appointment_time: Time.now
    )
    expect(scheduled_blood_work).to be_valid
  end

  it "is invalid without an appointment time" do
    scheduled_blood_work = ScheduledBloodWork.new(
      patient: patient,
      blood_work_type: blood_work_type,
      appointment_time: nil
    )
    expect(scheduled_blood_work).not_to be_valid
    expect(scheduled_blood_work.errors[:appointment_time]).to include("can't be blank")
  end
end