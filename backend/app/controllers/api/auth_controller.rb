class Api::AuthController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :authenticate_request, except: [:login, :refresh, :register]

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = JsonWebToken.encode({ user_id: user.id, exp: 1.month.from_now.to_i })
      refresh_token = JsonWebToken.encode({ user_id: user.id, exp: 1.day.from_now.to_i, refresh: true })
      render json: { token: token, refresh_token: refresh_token }, status: :ok
    else
      render json: { error: "Invalid Credentials" }, status: :unauthorized
    end
  end
    
  def refresh
    token = JsonWebToken.decode(params[:refresh_token])

    if token
      new_token = JsonWebToken.encode({ user_id: token[:user_id], exp: 1.month.from_now.to_i })
      render json: { token: new_token }, status: :ok
    else
      render json: { error: "Invalid refresh token" }, status: :unauthorized
    end
  end

  def register
    @user = User.new(user_params)

    if @user.save
      set_default_role
      token = JsonWebToken.encode({ user_id: @user.id, exp: 1.month.from_now.to_i })
      render json: { token: token }, status: :created
    else
      render json: { error: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :contact_number, :password, :password_confirmation)
  end

  def set_default_role
    Patient.create()
  end
end
