require 'rails_helper'

RSpec.describe V1::CurrentUser, type: :request do
  let :request_header do
    binary_header
  end

  describe 'GET /api/v1/current_user' do
    it 'responds successfully' do
      @user = FactoryBot.create :user
      set_auth_info @user
      get "/api/v1/current_user", {}, request_header
      expect(response.status).to eq 200
    end
  end
end
