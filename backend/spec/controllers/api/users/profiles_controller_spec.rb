require 'rails_helper'

RSpec.describe Api::Users::ProfilesController, type: :controller do
  let(:user) { create( :user )}
  let(:auth_headers) { { "Authorization" => "Bearer #{JsonWebToken.encode(user_id: user.id)}" } }

  describe "GET #show" do
    it "returns the current user's profile" do
      request.headers.merge!(auth_headers)
      get :show
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["email"]).to eq(user.email)
    end
  end

  describe "PUT #update" do
    it "updates the user's contact number" do
      request.headers.merge!(auth_headers)
      put :update, params: { user: { contact_number: "987654321" } }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["contact_number"]).to eq("987654321")
    end

    it "returns an error if the update fails" do
      request.headers.merge!(auth_headers)
      put :update, params: { user: { contact_number: nil } }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"]).to include("Contact number can't be blank")
    end
  end
end