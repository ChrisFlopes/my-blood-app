class Api::BloodWorkTypesController < ApplicationController
  require 'pry'
  before_action :authenticate_request

  def index
    blood_work_types = BloodWorkType.all
    render json: blood_work_types, status: :ok
  end

  def create
    blood_work_type = BloodWorkType.new(blood_work_type_params)

    if blood_work_type.save
      render json: blood_work_type, status: :created
    else
      render json: { errors: blood_work_type.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    blood_work_type = BloodWorkType.find(params[:id])

    if blood_work_type.update(blood_work_type_params)
      render json: blood_work_type, status: :ok
    else
      render json: { errors: blood_work_type.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def toggle_activation
    blood_work_type = BloodWorkType.find(params[:blood_work_type_id])
    new_activation_status = !blood_work_type.active
    message_phrase = new_activation_status ? 'Activated' : 'Deactivated'

    if blood_work_type.update(active: new_activation_status)
      render json: { message: "Blood work type #{message_phrase} successfully" }, status: :ok
    else
      render json: { errors: blood_work_type.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def blood_work_type_params
    params.require(:blood_work_type).permit(:name, :active, :min, :max)
  end
end