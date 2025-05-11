puts "Seeding database..."
puts "Dropping existing data..."
DoctorPatient.destroy_all
ScheduledBloodWork.destroy_all
BloodWorkType.destroy_all
Admin.destroy_all
LabTech.destroy_all
Doctor.destroy_all
Patient.destroy_all
User.destroy_all


puts "Creating users..."
users = [
  {
    name: "Joseph Martin",
    email: "josephmartin@aquaporservicos.pt",
    password: "password",
    password_confirmation: "password",
    contact_number: "123456789",
    roles: ["doctor", "patient"],
  },

  {
    name: "Maria Rodas",
    email: "mariorodas@lusagua.pt",
    password: "password",
    password_confirmation: "password",
    contact_number: "123456789",
    roles: ["lab_tech"]
  },

  {
    name: "Ana Silva",
    email: "anasilva@health.pt",
    password: "password",
    password_confirmation: "password",
    contact_number: "123456789",
    roles: ["patient"]
  },

  {
    name: "Luis Costa",
    email: "luicosta@clinic.pt",
    password: "password",
    password_confirmation: "password",
    contact_number: "123456789",
    roles: ["doctor"],
  },

  {
    name: "Admin",
    email: "admin@user.com",
    password: "password",
    password_confirmation: "password",
    contact_number: "123456789",
    roles: ["admin"],
  },
]


users.each do |user_data|
  user = User.create!(
    name: user_data[:name],
    email: user_data[:email],
    password: user_data[:password],
    password_confirmation: user_data[:password_confirmation],
    contact_number: user_data[:contact_number]
  )
  user_data[:roles].each do |role|
    case role
    when "admin"
      Admin.create!(user_id: user.id)
    when "lab_tech"
      LabTech.create!(user_id: user.id)
    when "doctor"
      Doctor.create!(user_id: user.id)
    when "patient"
      Patient.create!(user_id: user.id)
    end
  end
end

puts "Creating Blood Work Test Types..."

blood_work_test_types = [
  {
    name: "Cholesterol",
    units: "mg/dL",
    max: 200
  },
  {
    name: "Hemoglobin",
    units: "g/dL",
    min: 13.0,
    max: 17.0
  },
  {
    name: "Glucose",
    units: "mg/dL",
    min: 70,
    max: 99
  },
]

blood_work_test_types.each do |test_type_data|
  BloodWorkType.create!(
    name: test_type_data[:name],
    units: test_type_data[:units],
    min: test_type_data[:min],
    max: test_type_data[:max]
  )
end

puts "Creating Scheduled Blood Work..."
scheduled_blood_work = [
  {
    patient_id: User.find_by(email: "anasilva@health.pt").patient.id,
    blood_work_type_id: BloodWorkType.find_by(name: "Glucose").id,
    appointment_time: DateTime.new(Date.today.year, Date.today.month, 23, 8, 0, 0)
  },
  {
    patient_id: User.find_by(email: "anasilva@health.pt").patient.id,
    blood_work_type_id: BloodWorkType.find_by(name: "Cholesterol").id,
    appointment_time: DateTime.new(Date.today.year, Date.today.month, 24, 9, 0, 0)
  },
  {
    patient_id: User.find_by(email: "josephmartin@aquaporservicos.pt").patient.id,
    blood_work_type_id: BloodWorkType.find_by(name: "Hemoglobin").id,
    appointment_time: DateTime.new(Date.today.year, Date.today.month, 25, 10, 0, 0)
  },
]

scheduled_blood_work.each do |blood_work_data|
  ScheduledBloodWork.create!(
    patient_id: blood_work_data[:patient_id],
    blood_work_type_id: blood_work_data[:blood_work_type_id],
    appointment_time: blood_work_data[:appointment_time]
  )
end

puts "Creating Doctor Patient relationships..."
Doctor.all.each do |doctor|
  Patient.all.each do |patient|
    DoctorPatient.create!(
      doctor_id: doctor.id,
      patient_id: patient.id
    )
  end
end
