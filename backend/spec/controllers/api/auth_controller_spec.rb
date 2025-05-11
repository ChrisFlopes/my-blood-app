require 'rails_helper'

RSpec.describe Api::AuthController, type: :controller do
  describe "POST #register" do
    it "registers a new user" do
      post :register, params: {
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password",
          password_confirmation: "password",
          contact_number: "123456789"
        }
      }
      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["token"]).not_to be_nil
    end

    it "returns an error if registration fails" do
      post :register, params: { user: { email: nil } }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("Email can't be blank")
    end
  end
end