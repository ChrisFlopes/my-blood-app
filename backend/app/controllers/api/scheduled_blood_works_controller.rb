class Api::ScheduledBloodWorksController < ApplicationController
  before_action :authenticate_request
  before_action :set_scheduled_blood_work, only: [:cancel, :approve, :reject]
  skip_before_action :verify_authenticity_token

  def index
    @patient = Patient.find(params[:patient_id])
    blood_works = @patient.scheduled_blood_works

    render json: blood_works.as_json(
      only: [:id, :appointment_time, :approved, :rejected, :cancelled],
      methods: [:patient_name, :blood_work_type_name]
    )
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Patient not found." }, status: :not_found
  end

  def create
    @patient = Patient.find(params[:patient_id])
    @scheduled_blood_work = ScheduledBloodWork.new(scheduled_blood_work_params)
    @scheduled_blood_work.patient = @patient

    if @current_user&.patient&.id == @patient.id
      render json: { message: "Similar Appointment already requested" } if similar_appointment_within_week
      return
    end

    if @scheduled_blood_work.save
      render json: { message: "Scheduled blood work created successfully" }, status: :created
    else
      render json: { errors: scheduled_blood_work.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def requests
    open_requests = set_scheduled_blood_work.open_requests
    render json: open_requests, status: :ok
  end

  def approved
    approved_requests = set_scheduled_blood_work.approved
    render json: approved_requests, status: :ok
  end

  def rejected
    rejected_requests = set_scheduled_blood_work.rejected
    render json: rejected_requests, status: :ok
  end

  def cancelled
    cancelled_requests = set_scheduled_blood_work.cancelled
    render json: cancelled_requests, status: :ok
  end

  def cancel
    if @scheduled_blood_work.patient == @current_user.patient
      render json: { message: "Too close to appointment time" } if within_3_hours?
      return
    end

    if @scheduled_blood_work.update(cancelled: true)
      render json: { message: "Scheduled blood work successfully cancelled." }, status: :ok
    else
      render json: { errors: @scheduled_blood_work.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def approve
    return if !@current_user.doctor

    if @scheduled_blood_work.update(approved: true, rejected: false)
      render json: { message: "Scheduled blood work successfully approved." }, status: :ok
    else
      render json: { errors: @scheduled_blood_work.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def reject
    return if !@current_user.doctor

    if @scheduled_blood_work.update(rejected: true, approved: false)
      render json: { message: "Scheduled blood work successfully rejected." }, status: :ok
    else
      render json: { errors: @scheduled_blood_work.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def doctor_requests
    if @current_user.doctor
      patients = @current_user.doctor.patients
      blood_works = ScheduledBloodWork.where(patient: patients)
      render json: blood_works.as_json(
        only: [:id, :appointment_time, :approved, :rejected, :cancelled],
        methods: [:patient_name, :blood_work_type_name]
      )
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  private

  def set_scheduled_blood_work
    @scheduled_blood_work = ScheduledBloodWork.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Scheduled blood work not found." }, status: :not_found
  end

  def scheduled_blood_work_params
    params.require(:scheduled_blood_work).permit(:patient_id, :blood_work_type_id, :appointment_time)
  end

  def similar_appointment_within_week
    start_of_week = @scheduled_blood_work.appointment_time.beginning_of_week(:monday)
    end_of_week = @scheduled_blood_work.appointment_time.end_of_week(:sunday)

    @patient.scheduled_blood_works
            .where(blood_work_type_id: @scheduled_blood_work.blood_work_type_id)
            .where(appointment_time: start_of_week..end_of_week)
            .where(rejected: false)
            .where(cancelled: false)
            .exists?
  end

  def within_3_hours?
    (@scheduled_blood_work.appointment_time - Time.now) < 3.hours
  end
end