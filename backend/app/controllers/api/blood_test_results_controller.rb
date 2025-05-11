require 'csv'

class Api::BloodTestResultsController < ApplicationController
  before_action :authenticate_request
  skip_before_action :verify_authenticity_token

  def create
    blood_test_result = BloodTestResult.new(blood_test_result_params)
    if blood_test_result.save
      render json: { message: "Blood test result created successfully" }, status: :created
    else
      render json: { errors: blood_test_result.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    if @current_user.patient
      blood_test_results = BloodTestResult.includes(:blood_work_type)
                                          .where(patient: @current_user.patient)
                                          .order(:measured_at)

      grouped_results = blood_test_results.group_by { |result| result.blood_work_type.name }

      render json: grouped_results.transform_values do | blood_work_type_name, results |
        {
          blood_work_type_name: blood_work_type_name,
          min: results.map(&:measured_value).min,
          max: results.map(&:measured_value).max,
          data: results.map do |result|
            {
              measured_value: result.measured_value,
              measured_unit: result.measured_unit,
              measured_at: result.measured_at
            }
          end
        }
      end
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  def import_csv
    file = params[:file]

    if file.nil?
      render json: { error: "No file passed" }, status: :bad_request
      return
    end

    begin
      CSV.foreach(file.path, headers: true) do | row |
        patient = Patient.search_by_email(row["patient_email"]).first
        blood_work_type = BloodWorkType.find_by(name: row["test_type"])

        if patient.nil? || blood_work_type.nil?
          next
        end

        BloodTestResult.create!(
          patient: patient,
          blood_work_type: blood_work_type,
          measured_value: row["measured_value"],
          measured_unit: row["unit"],
          measured_at: row["measured_at"]
        )
      end

      render json: { message: "CSV import success" }, status: :ok
    rescue => e
      render json: { error: "Failed to process CSV: #{e.message}" }, status: :unprocessable_entity
    end
  end

  private

  def blood_test_result_params
    params.require(:blood_test_result).permit(:patient_id, :blood_work_type_id, :measured_value, :measured_unit, :measured_at)
  end
end