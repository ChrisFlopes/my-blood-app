class JwtService
  def self.decode(token)
    JWT.decode(token, ENV["SECRET_KEY_BASE"])[0]
    rescue JWT::ExpiredSignature
      raise "Token has expired"
    rescue JWT::DecodeError
      raise "Invalid token"
  end
end