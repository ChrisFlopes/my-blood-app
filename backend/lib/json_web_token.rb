class JsonWebToken
  SECRET_KEY = ENV['SECRET_KEY_BASE']
  
  def self.encode(payload, exp = 24.hours.from_now.to_i)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end
  
  def self.decode(token)
    puts "SECRET_KEY: #{SECRET_KEY.inspect}"
    puts "Token: #{token.inspect}"
    decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::ExpiredSignature
    puts "Token has expired"
    nil
  rescue JWT::DecodeError => e
    puts "Decode error: #{e.message}"
    nil
  end
end