require 'pry'
class Api::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update_roles, :remove_role]

  def index
    @users = User.all

    response_data = @users.map do |user|
      user_data = user.as_json(only: [:id, :name, :email, :contact_number])
      user_data[:roles] = user.roles_list
      user_data
    end

    render json: response_data, status: :ok
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def show
    @user = User.find(params[:id])
    render json: @user, status: :ok
  end

  def update_roles
    user = User.find(params[:user_id])

    if params[:role].present?
      case params[:role]
      when 'admin'
        user.admin || Admin.create(user: user)
      when 'doctor'
        user.doctor || Doctor.create(user: user)
      when 'patient'
        user.patient || Patient.create(user: user)
      when 'lab_tech'
        user.lab_tech || LabTech.create(user: user)
      else
        render json: { error: 'Invalid role' }, status: :unprocessable_entity and return
      end
      render json: { message: 'Role updated successfully' }, status: :ok
    end
  end

  def remove_role
    user = User.find(params[:user_id])

    if params[:role].present?
      case params[:role]
      when 'admin'
        user.admin&.destroy if user.admin
      when 'doctor'
        user.doctor&.destroy if user.doctor
      when 'patient'
        user.patient&.destroy if user.patient
      when 'lab_tech'
        user.lab_tech&.destroy if user.lab_tech
      else
        render json: { error: 'Invalid role' }, status: :unprocessable_entity and return
      end
      render json: { message: 'Role removed successfully' }, status: :ok
    end
  end
end
