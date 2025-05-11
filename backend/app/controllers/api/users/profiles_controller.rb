class Api::Users::ProfilesController < ApplicationController
  before_action :authenticate_request
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token

  def show
    if @current_user
      response_data = @current_user.as_json(only: [:id, :name, :email, :contact_number])
      response_data[:doctor_id] = @current_user.doctor&.id
      response_data[:patient_id] = @current_user.patient&.id
      response_data[:lab_tech_id] = @current_user.lab_tech&.id
      response_data[:admin_id] = @current_user.admin&.id
      render json: response_data, status: :ok
    else
      render json: { error: "User not found" }, status: :not_found
    end  
  end

  def update
    if @current_user.update(profile_params)
      render json: @current_user, status: :ok
    else
      puts @current_user.errors.full_messages.inspect
      render json: {errors: @current_user.errors.full_messages}, status: :unprocessable_entity
    end
  end

  private

  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header

    begin
      decoded = JwtService.decode(token)
      @current_user = User.find(decoded["user_id"])
    rescue => e
      render json: { error: e.message }, status: :unauthorized
    end
  end

  def profile_params
    params.require(:profile).permit(:name, :email, :contact_number, :password, :password_confirmation)
  end
end
