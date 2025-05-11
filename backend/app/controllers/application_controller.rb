class ApplicationController < ActionController::Base
  require 'pry'

  skip_before_action :verify_authenticity_token
  protect_from_forgery with: :exception

  private

  def authenticate_request
    header = request.headers["Authorization"]
    token = header.split(" ").last if header
  
    begin
      decoded = JsonWebToken.decode(token)
      @current_user = User.find(decoded["user_id"])
    rescue JWT::ExpiredSignature
      render json: { error: "Token has expired" }, status: :unauthorized
    rescue JWT::DecodeError
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end
end
