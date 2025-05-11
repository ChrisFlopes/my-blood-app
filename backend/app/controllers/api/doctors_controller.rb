class Api::DoctorsController < ApplicationController
  before_action :authenticate_request
  skip_before_action :verify_authenticity_token

  def patients
    doctor = Doctor.find_by(id: params[:doctor_id])

    if doctor && doctor.user == @current_user
      patients = doctor.patients.map do |patient|
        {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          contact_number: patient.contact_number
        }
      end
      
      render json: patients.as_json(only: [:id, :name, :email, :contact_number])
    else
      render json: { error: "Unauthorized or doctor not found" }, status: :unauthorized
    end
  end

  def assign_patient
    @doctor = Doctor.find(params[:doctor_id])
    @patient = Patient.find(params[:patient_id])

    if @patient.nil?
      render json: {error: "Patient not found" }, status: :not_found
      return
    end

    doctor_patient = DoctorPatient.new()
    doctor_patient.doctor = @doctor
    doctor_patient.patient = @patient

    if doctor_patient.save
      render json: { message: "Patient Successfully Assigned" }, status: :created
    else
      render json: { errors: doctor_patient.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def unassign_patients
    doctor_patient = DoctorPatient.find_by(
      doctor_id: params[:doctor_id],
      patient_id: params[:patient_id]
    )

    if doctor_patient
      doctor_patient.destroy
      render json: { message: "Patient unassigned" }, status: :ok
    else
      render json: { error: "Unable to find relation" }, status: :not_found
    end
  end
end