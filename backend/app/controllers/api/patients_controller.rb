require 'csv'

class Api::PatientsController < ApplicationController
  before_action :authenticate_request
  skip_before_action :verify_authenticity_token

  def show
    patient = Patient.find_by(id: params[:id])

    if patient
      render json: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        contact_number: patient.contact_number,
      }, status: :ok
    else
      render json: { error: "Patient not found" }, status: :not_found
    end
  end

  def index
    patients = Patient.all

    render json: patients.map { | patient |
      {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        contact_number: patient.contact_number,
        doctors_ids: get_doctor_ids(patient)
      }
    }, status: :ok
  end

  def blood_test_results
    patient = Patient.find_by(id: params[:id])

    if patient
      test_results = BloodTestResult.includes(:blood_work_type).where(patient: patient).order(:measured_at)

      grouped_results = test_results.group_by(&:blood_work_type)

      render json: grouped_results.map do |blood_work_type, results|
        {
          blood_work_type_name: blood_work_type.name, # Use the blood_work_type name
          data: results.map do | result |
            {
              measured_value: result.measured_value,
              measured_unit: result.measured_unit,
              measured_at: result.measured_at
            }
          end
        }
      end
    else
      render json: { error: "Patient not found" }, status: :not_found
    end
  end

  def scheduled_blood_work
    patient = Patient.find_by(id: params[:id])
    
    blood_work = ScheduledBloodWork.where(patient: patient)
    render json: blood_works.as_json(
      only: [:id, :appointment_time, :approved, :rejected, :cancelled],
      methods: [:patient_name, :blood_work_type_name]
    )
  end

  def export_csv
    patient = Patient.find(params[:patient_id])

    if patient.nil?
      render json: { error: "Patient not found" }, status: :not_found
      return
    end

    blood_test_results = BloodTestResult.includes(:blood_work_type)
                                        .where(patient: patient)
                                        .order(:measured_at)

    csv_data = CSV.generate(headers: true) do |csv|
      csv << ["patient_email", "test_type", "measured_value", "unit", "measured_at"]

      blood_test_results.each do |result|
        csv << [
          result.patient.email,
          result.blood_work_type.name,
          result.measured_value,
          result.measured_unit,
          result.measured_at
        ]
      end
    end

    send_data csv_data, filename: "patient_#{patient.id}_results.csv", type: "text/csv"
  end

  def get_doctor_ids(patient)
    result = []
    patient.doctors.each do | doctor |
      result << doctor.id
    end
    result
  end
end